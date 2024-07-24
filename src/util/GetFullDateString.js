export default function GetFullDateString(date = new Date()){
  return `${date.toLocaleString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })} del ${date.getFullYear()}`
}