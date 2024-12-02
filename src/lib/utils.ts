import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { hexlify, keccak256, randomBytes, toUtf8Bytes } from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'BS'
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'USD', notation = 'compact' } = options

  const numericPrice =
    typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export function formatDateToLocal(
  dateStr: string,
  locale: string = 'en-US',
) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export function dataToHash(dataBytes: Uint8Array) {
  const hash = keccak256(dataBytes);
  return hash;
}

export function getRandomBytes(length: number) {
  let random = hexlify(randomBytes(length));
  random = random.replace('0x', '');
  const hash = dataToHash(toUtf8Bytes(random));
  return { random, hash };
}
