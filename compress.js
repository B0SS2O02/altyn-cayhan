const sharp = require('sharp')
const { deleteFile } = require('./src/api/shared/deleteFile')
const ProdCategory = require('./src/api/product/prodCategory')

const Product = require('./src/api/product/product')
const crypto = require('crypto')
const fs = require('fs')
const compress = async () => {

    const category = await Product.findAll()

    for (let index = 0; index < category.length; index++) {
        const element = category[index];
        const image = `.${element.image}`
        console.log(image,'old')
        if (fs.existsSync(image)) {
            const nameImg = crypto.randomBytes(5).toString('hex')
            const mainImgPath = addNewPath(nameImg)    
            await formatImages(image, `.${mainImgPath}`)
            element.image = mainImgPath
            await element.save()
        }else{
            console.log('not exists')
        }
    }
}

const addNewPath = (newPathImg) => {
    return `/uploads/product/${new Date().toISOString().replace(/:/g, "-") + "_"
        }${newPathImg}.webp`;
};

const formatImages = async (oldImagePath, newImagePath) => {
    await sharp(oldImagePath)
        .toFormat("webp")
        .resize(360)
        .webp({ quality: 50 })
        .toFile(newImagePath);
    await deleteFile(oldImagePath);
};
compress()
