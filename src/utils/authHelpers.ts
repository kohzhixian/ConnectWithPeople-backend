export default function isValidSGNum(phone_number: number) {
  const regex = /^(6|8|9)\d{7}$/;
  return regex.test(String(phone_number));
}
