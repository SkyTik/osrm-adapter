function reverseCoordinateString(coordinate: string) {
  return coordinate.split(",").reverse().join(",");
}

function getIp(headers: Record<string, string | undefined>) {
  if (!headers) return;
  if ("x-real-ip" in headers) return headers["x-real-ip"];

  if ("x-forwarded-for" in headers) {
    const ipList = headers["x-forwarded-for"]?.split(",");
    if (ipList) {
      return ipList[ipList.length - 1].trim();
    }
  }
}

const utils = { reverseCoordinateString };
export { getIp };

export default utils;
