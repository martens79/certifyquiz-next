import sharp from "sharp";

const input = "public/images/logo-certifyquiz.png";

await sharp(input)
  .resize(192, 192, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile("public/icons/icon-192.png");

await sharp(input)
  .resize(512, 512, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile("public/icons/icon-512.png");

console.log("PWA icons generated");
