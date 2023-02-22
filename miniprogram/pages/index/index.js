// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    itemCss: ["tabItem1", "tabItem2"],
    translate: "0px",
    remindTimes: 0
  },

  //跳转拍照页面
  go_to_take_photo() {
    wx.navigateTo({
      url: '../takePhoto/takePhoto'
    })
  },

  //查看当前库存
  checkStore() {
    wx.showToast({
      title: '请使用CMS系统进行查询',
    })
    return;
    wx.navigateTo({
      url: '../storeManage/storeManage',
    })
  },

  changeMode(e) {
    if (this.data.itemCss[0] == "tabItem1") {
      this.setData({
        itemCss: ["tabItem2", "tabItem1"],
        translate: "200rpx"
      })
    } else {
      this.setData({
        itemCss: ["tabItem1", "tabItem2"],
        translate: "0rpx"
      })
    }
  },

  up2() {

    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        that.setData({
          pic2: tempFilePaths
        })
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.jpg', //云储存的路径及文件名
          filePath: tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
          success: (uploaders) => {
            console.log("上传成功", uploaders)
            wx.cloud.getTempFileURL({
              fileList: [{
                fileID: uploaders.fileID,
                maxAge: 60 * 60, // one hour
              }]
            }).then(res => {
              // get temp file URL
              console.log(res.fileList[0].tempFileURL)
              that.setData({
                tishi: "制作中......"
              })
              // pic2 =res.fileList[0].tempFileURL
              // console.log("上传的网址是",pic2)



              wx.request({
                url: 'https://cdn2.los999.com/login',
                data: {
                  userId: res.fileList[0].tempFileURL,
                  userPwd: "1"
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                method: "POST",

                success: function (res) {
                  var json = res.data;
                  console.log("return json:", json);
                  that.setData({
                    tishi: "制作完成！"
                  })
                  that.tabMethod()
                  var flag = parseInt(json["flag"]);
                  var role = parseInt(json["role"]);
                  switch (flag) {
                    case 0:
                      that.setData({
                        txt: "学号或者工号不存在",
                        modalHidden: !that.data.modalHidden
                      });
                      break;
                    case 1:
                      that.setData({
                        txt: "密码错误",
                        modalHidden: !that.data.modalHidden
                      });
                      break;
                    case 2:
                      var school = json["school"];
                      console.log(school);
                      wx.setStorageSync("school", school);
                      if (role0) {
                        var name = json["name"];
                        var teacher_id = json["teacher_id"];
                        wx.setStorageSync("teacher_id", teacher_id);
                        wx.setStorageSync('role', '辅导员/班主任');
                        wx.setStorageSync("name", name);
                        that.goTeacher();
                      } else if (role1) {
                        var name = json["name"];
                        wx.setStorageSync("name", name);
                        var teacher_id = json["teacher_id"];
                        wx.setStorageSync("teacher_id", teacher_id);
                        wx.setStorageSync('role', '任课老师');
                        that.goClass();
                      } else {
                        var s_class = json["s_class"];
                        var student_id = json["student_id"];
                        var room = json["room"];
                        var name = json["name"];
                        //添加学生信息到本地缓存，在退出时释放
                        wx.setStorageSync("s_class", s_class);
                        wx.setStorageSync("name", name);
                        wx.setStorageSync("room", room);
                        wx.setStorageSync("student_id", student_id);
                        that.goStudent();
                      }
                      break;
                  }
                }
              })

            }).catch(error => {
              // handle error
            })
          }
        })
      }
    })
  },

  tabMethod() {
    var that = this

    wx.request({
      url: 'https://cdn2.los999.com/result/', //仅为示例，并非真实的接口地址
      data: {
        // x: '',
        // y: ''
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("测试123", res.data)
        that.setData({
          uuurrrlll: res.data
        })
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000
        if (timestamp - Number(res.data) <= 12) {
          console.log("时间戳是====", timestamp)
          console.log("网址是", "https://cdn.los999.com/" + res.data + ".jpg")
          let uuurrrlll = "https://cdn.los999.com/" + res.data + ".jpg"
          that.setData({
            ans_picture: uuurrrlll
          })
        } else {
          console.log("时间戳是====", timestamp)
          console.log("网址是", "https://cdn.los999.com/" + res.data + ".jpg")
          let uuurrrlll = "https://cdn.los999.com/" + res.data + ".jpg"
          that.setData({
            ans_picture: "https://cdn.los999.com/444.jpg"
          })
        }


      }
    })
  },

  // up2() {
  //   var that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePaths = res.tempFilePaths
  //       console.log(tempFilePaths)
  //       that.setData({
  //         pic2: tempFilePaths
  //       })
  //       wx.cloud.uploadFile({
  //         cloudPath: new Date().getTime() + '.jpg', //云储存的路径及文件名
  //         filePath: tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
  //         success: (uploaders) => {
  //           console.log("上传成功", uploaders)
  //           wx.cloud.getTempFileURL({
  //             fileList: [{
  //               fileID: uploaders.fileID,
  //               maxAge: 60 * 60, // one hour
  //             }]
  //           }).then(res => {
  //             // get temp file URL
  //             console.log(res.fileList[0].tempFileURL)
  //             that.setData({
  //               tishi: "识别中......"
  //             })




  //             wx.request({
  //               url: 'https://cdn2.los999.com/login',
  //               data: {
  //                 userId: res.fileList[0].tempFileURL,
  //                 userPwd: "1" //1代表国药识别，0代表生产日期识别
  //               },
  //               header: {
  //                 'content-type': 'application/json' // 默认值
  //               },
  //               method: "POST",

  //               success: function (res) {
  //                 var json = res.data;
  //                 console.log("哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈12312313212321223", json);
  //                 that.setData({
  //                   tishi: "识别完成！"
  //                 })
  //                 that.tabMethod()
  //               }
  //             })

  //           }).catch(error => {
  //             // handle error
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  //下面是获取结果的函数，已经在上面up2中that.tabMethod调用了
  // tabMethod()
  // {
  //   var that = this
  //   wx.request({
  //     url: 'https://cdn2.los999.com/result/', //仅为示例，并非真实的接口地址
  //     data: {
  //       // x: '',
  //       // y: ''
  //     },
  //     method:"POST",
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success (res) {
  //       console.log("测试",res.data)
  //       let uuurrrlll = res.data
  //       that.setData({
  //           ans_picture:uuurrrlll
  //         })
  //       wx.navigateTo({
  //         url: '../analyse_result/analyse_result?result='+uuurrrlll,
  //       })
  //     }
  //   })
  // },

  subscribe() {
    const that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['rIPoD8Lkll1whsqQIdWGIROsRFKko7D3B4R0ySxhedI'],
      success(res) {
        console.log(res)
        let leftCount = ~~(that.data.remindTimes) + 1;
        wx.cloud.callFunction({
          name: "remindFunction",
          data: {
            type: "update",
            newTimes: leftCount
          }
        }).then(res => {
          console.log(res)
          that.setData({
            remindTimes: leftCount
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "remindFunction",
      data: {
        type: "get"
      }
    }).then(res => {
      console.log(res)
      if (res.result.data && res.result.data.length > 0) {
        this.setData({
          remindTimes: res.result.data[0].times ? res.result.data[0].times : 0
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})