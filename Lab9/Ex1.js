date = 10;
month = 8;
year = 2000;

s1 = year % 100;
s2 = Math.floor(s1 % 4);
s3 = s2 + s1;
s4 = 2;
s6 = s4 + s3;
s7 = s6 + date;
s8 = s7 - 1;
s9 = s8 % 7;

console.log(`My birthday falls on a ${s9}.`)