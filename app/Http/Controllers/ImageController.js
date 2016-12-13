'use strict'
const Helpers = use('Helpers');
const Image = use('App/Model/Image');
var path = require('path');
var fs = require('fs');
var mv = require('mv');
class ImageController {
     * index (request, response) {
    yield response.sendView('image');
  }
  * getimage (request,responce) {
        const fileId = request.param('fileId')
        const file = yield Image.findorFail(fileId)
        response.download(Helpers.storagePath('uploads/${file.path}'))
  }
  * storeimage (request, response) {
    //logic to store image

//     var source = fs.createReadStream('/path/to/source');
// var dest = fs.createWriteStream('/path/to/dest');

// source.pipe(dest);
// source.on('end', function() { /* copied */ });
// source.on('error', function(err) { /* error */ });
    const file = request.file('image_name');
    const fileName = file.file.name;
    const filepath = file.file.path;
    //console.log('thsi is the file source',filepath);
    const image_path = Helpers.storagePath('images')+"/"+fileName;

//     console.log("this is the target path ",image_path);
//     fs.writeFile(image_path,file, function (err) {
//         console.log('error');
//   });


    // var tempPath = req.files.file.path;
    // targetPath = path.resolve('./uploads/image.png');
    // fs.rename(file.file.path, image_path+"/"+fileName, function(err) {
    //     if (err) throw err;
    //     console.log("Upload completed!");
    // });
    // fs.rename(filepath, image_path, function(err) {
    //     if (err) throw err;
    //     // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    //     // fs.unlink(tmp_path, function() {
    //     //     if (err) throw err;
    //     //     res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
    //     // });
    // });
    mv(filepath,image_path, function(err) {
    if (err) { throw err; }
console.log('file moved successfully');
});

    // file.move(image_path,fileName);

    const image = new Image();
    image.imagename = fileName;
    //console.log(image);
    yield image.save();
    yield response.sendView('image');
}
}

module.exports = ImageController