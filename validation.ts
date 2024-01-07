// export const validateIndex = (
//   value: string,
//   dataLength: number
// ): boolean | string => {
//   const parsedValue = parseInt(value, 10);
//   console.log("parsedValue", parsedValue);
//   console.log("dataLength", dataLength);
//   console.log("!isNaN(parsedValue)", !isNaN(parsedValue));
//   console.log("parsedValue >= 0", parsedValue >= 0);
//   console.log("parsedValue < dataLength", parsedValue < dataLength);
//   if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue < dataLength) {
//     return true;
//   }
//   return "Vui long nhap so thu tu sinh vien hop le";
// };

export const validateIndex = (dataLength: number) => {
  return (value: string): boolean | string => {
    const parsedValue = parseInt(value, 10);
    console.log("parsedValue", parsedValue);
    console.log("dataLength", dataLength);
    console.log("!isNaN(parsedValue)", !isNaN(parsedValue));
    console.log("parsedValue >= 0", parsedValue >= 0);
    console.log("parsedValue < dataLength", parsedValue < dataLength);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue < dataLength) {
      return true;
    }
    return "Vui long nhap so thu tu sinh vien hop le";
  };
};

export const validateName = (value: string): boolean | string => {
  if (value) {
    return true;
  }
  return "Vui long nhap ten sinh vien";
};

export const validateAge = (value: string): boolean | string => {
  const parsedValue = Number(value);
  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return true;
  }
  return "Vui long nhap so tu nhien lon hon 0";
};

export const validateTitle = (value: string): boolean | string => {
  if (value) {
    return true;
  }
  return "Vui long nhap chuc vu sinh vien";
};
