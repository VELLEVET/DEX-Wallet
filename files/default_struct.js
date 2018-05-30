const level1 = [0, 103, 113, 119, 120, 121, 1325];

const level2 = [
  0,
  103,
  113,
  119,
  120,
  121,
  1325,
  1653,
  562,
  2241,
  861,
  2543,
  1630,
  1621,
  106,
  105,
  2913,
  2914
];

export const savedState = level1.map(item => {
  let nObj = {
    key: item,
    quotes: [...level2].filter(task => task !== item)
  };
  return nObj;
});

export const defaultRoute = [
  {
    title: "Default",
    key: "0",
    quotes: [
      {
        title: "Default",
        key: "103",
        quote_volume: "1000",
        percent_change: "1000"
      }
    ]
  }
];
