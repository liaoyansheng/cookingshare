/**
 * Promise化小程序接口
 */
class Wechat {

  /**
 * 从本地相册选择图片或使用相机拍照。
 * @param {number} count 最多可选图片的数量
 * @param {array} sizeType original 原图，compressed 压缩图
 * @param {array} sourceType album 从相册选图，camera 使用相机
 */
  static chooseImage(count = 1, sizeType = ['compressed'], sourceType = ['album', 'camera']) {
    return new Promise((resolve, reject) => wx.chooseImage({ count, sizeType, sourceType, success: resolve, fail: reject }));
  }
  /**
   * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
   * @param {boolean} compressed 是否压缩
   * @param {array} sourceType album 从相册选图，camera 使用相机
   * @param {number} maxDuration 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
   */
  static chooseVideo(compressed = true, sourceType = ['album', 'camera'], maxDuration = 60) {
    return new Promise((resolve, reject) => wx.chooseVideo({ sourceType, compressed, maxDuration, success: resolve, fail: reject }));
  }

  /**
 * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求
 * @param {string} url 开发者服务器 url
 * @param {string} filePath 要上传文件资源的路径
 * @param {string} name 
 * @param {object} formData HTTP 请求中其他额外的 form data
 */
  static uploadFile(url, filePath, name, formData = { openid: "test" }) {
    return new Promise((resolve, reject) => {
      let opts = { url, filePath, name, formData, header: { 'Content-Type': "multipart/form-data" }, success: resolve, fail: reject };
      wx.uploadFile(opts);
    });
  }


}
module.exports = Wechat;