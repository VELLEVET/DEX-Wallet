import { savedState } from '../files/default_struct.js';
import {objMap}  from '../files/objMap.js';

export function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}

function fetcher(id, method, params) {
  return fetch('https://api-ru.bts.blckchnd.com', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: id,
      method: method,
      params: params,
    }),
  }).then(result => result.json());
}

function fetchData() {
  let count = -1;
  let value = '';

  let newSS = savedState
    .reduce((acc, { key, quotes }) => {
      quotes.forEach(quote => acc.push({ key, quote }));
      return acc;
    }, [])
    .map(pair => {
      if (pair.key !== value) {
        count++;
        value = pair.key;
      }
      return fetcher(count, 'get_ticker', [
        '1.3.' + pair.key,
        '1.3.' + pair.quote,
      ]);
    });

  return Promise.all(newSS);
}

const fetchSavedState = () =>
  fetchData(savedState).then(items => {
    let count = -1;
    let arri = [];
    items.forEach(item => {
      let qNum = item.result.quote.slice(4);
      let bNum = item.result.base.slice(4);
      if (item.id > count) {
        arri.push({
          title: objMap[bNum].symbol,
          key: bNum,
          quotes: [],
        });
        count++;
      }

      arri[count].quotes.push({
        percent_change: item.result.percent_change + '%',
        base_volume: item.result.base_volume,
        latest: parseFloat(
          Number(item.result.latest).toFixed(objMap[bNum].precision)
        ),
        title: objMap[qNum].symbol,
        key: qNum,
        time: item.result.time,
        favorite:false
      });
    });
    return { routes: arri, loading: false, refreshing: false };
  });

export function mapCreate() {
  return fetcher(1, 'get_assets', [
    Object.keys(objMap).map(item => '1.3.' + item),
  ])
    .then(result2 => {
      result2.result.forEach(item => {
        objMap[item.id.slice(4)] = item;
      });
    })
    .then(fetchSavedState)
    .catch(error => {
      alert('Network error!');
      console.error(error);
    });
}

export function updateTab(index, stateRoutes) {
  console.log('Updating tab...');

  let currentRoute = [...savedState][index];
  let routes = [...stateRoutes];
  return Promise.all(
    currentRoute.quotes.map(quote =>
      fetcher(1, 'get_ticker', ['1.3.' + currentRoute.key, '1.3.' + quote])
    )
  )
    .then(items => {
      for (let i = 0; i < currentRoute.quotes.length; i++) {
        let routObj = routes[index].quotes[i];
        let qKey = items[i].result.quote.slice(4);
        let bKey = items[i].result.base.slice(4);
        routObj.key = qKey;
        routObj.percent_change = items[i].result.percent_change + '%';
        routObj.latest = Number(items[i].result.latest).toFixed(
          objMap[bKey].precision
        );
        routObj.base_volume = items[i].result.base_volume;
        routObj.time = items[i].result.time;
      }
    })
    .then(() => {
      return {
        routes: routes,
        refreshing: false,
      };
    })
    .catch(error => {
      alert('Network error.');
      console.error(error);
    });
}

let sorty = (a, b) => {
  if (a === b) return 0;
  return a < b ? 1 : -1;
};

let sortyBack = (a, b) => {
  if (a === b) return 0;
  return a > b ? 1 : -1;
};

export function sortRouter(index) {
  let f = sorty;
  let argum = [
    (a, b) => f(b.title, a.title),
    (a, b) => f(parseFloat(a.latest), parseFloat(b.latest)),
    (a, b) => f(parseFloat(a.percent_change), parseFloat(b.percent_change)),
    (a, b) => f(parseFloat(a.base_volume), parseFloat(b.base_volume)),
  ];
  if (index > 99) {
    f = sortyBack;
    index -= 100;
  }

  return (a, b) => {
    return argum[index](a, b);
  };
}
