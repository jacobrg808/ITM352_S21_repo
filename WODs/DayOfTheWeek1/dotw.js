// Test
day = 10;
month = "August";
year =  2000;

// Algorithm
s1 = year % 100;
s2 = Math.floor(s1 % 4);
s3 = s2 + s1;
monthKey = 1;
s6 = monthKey + s3;
s7 = day + s6;
s8 = (typeof s5 !== "undefined") ? s5 : s7;
s9 = s8 % 7;

if (s9 == 0) {dotw = "Sunday";}
else if (s9 == 1) {dotw = "Monday";}
else if (s9 == 2) {dotw = "Tuesday";}
else if (s9 == 3) {dotw = "Wednesday";}
else if (s9 == 4) {dotw = "Thursday";}
else if (s9 == 5) {dotw = "Friday";}
else if (s9 == 6) {dotw = "Saturday";}

// Output
console.log(`${month} ${day}, ${year} was on a ${dotw}.`)