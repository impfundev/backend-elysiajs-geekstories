// global.d.ts

/* Memberitahu TypeScript bahwa setiap file yang diimpor 
  yang berakhiran dengan .css adalah "modul" yang valid.
  
  Ini secara efektif membungkam eror "Cannot find module"
  untuk impor "side-effect" seperti ini.
*/
declare module "*.css";
