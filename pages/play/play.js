// play.js
var img_path = '../../files/'
var gbdata = getApp()
var all_players = [
  { 
    id:0, name: '钢铁侠', path: img_path + 'gtx.jpeg', word: '', identity:'', 
    score: 0, pingmin: 0, uc: 0, baiban: 0, dead: 0, display: "",
  },
  { id: 1, name: '美队', path: img_path + 'md.jpeg', word: '', identity: '', 
    score: 0, pingmin: 0, uc: 0, baiban: 0, dead: 0, display: "",},
  { id: 2, name: '黑寡妇', path: img_path + 'hgf.jpeg', word: '', identity: '',  
    score: 0, pingmin: 0, uc: 0, baiban: 0, dead: 0, display: "",},
  { id: 3, name: '蜘蛛侠', path: img_path + 'zzx.jpeg', word: '', identity: '', 
    score: 0, pingmin: 0, uc: 0, baiban: 0, dead: 0, display: "",},
  { id: 4, name: '雷神', path: img_path + 'ls.jpeg', word: '', identity: '', 
    score: 0, pingmin: 0, uc: 0, baiban: 0, dead: 0, display: "",},
  { id: 5, name: '绿巨人', path: img_path + 'ljr.jpeg', word: '', identity: '',
    score: 0, pingmin: 0, uc: 0, baiban: 0, dead: 0, display: "",},
  ]


var filter = [];
var my_rand = function(size, num){
  var ans = [];
  while(ans.length < num){
    var arand = Math.floor(Math.random() * 100) % size;
    if(!ans.includes(arand))
      ans.push(arand);
  }
  return ans;
}

var bg = '#ffffff';
console.log('page play')
var warn_word = '请先发词';
var warn_img = img_path + 'warn.jpeg';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    players: null,
    baiban: null,
    UC:null,
    bgc: [bg, bg, bg, bg, bg, bg,],
    surviver:[],
    dead: [],
    iden : { 0: "白板", 1: "卧底", 2: "平民" },
    display_iden: ['','','','','',''],
    round: 0,
    win: {winner:'none', path:''},
    identity: true,
    start: false,
  },

  //发词
  toastShow:function() {
    this.data.start = true;

    //init data
    var survive = []
    for (var i = 0; i < gbdata.globalData.player_num; i++)
      survive.push(i);
    this.data.identity = true;
    this.setData({
      // players: this.data.players,
      bgc: [bg, bg, bg, bg, bg, bg,],
      surviver: survive,
      dead: [],
      display_iden: ['', '', '', '', '', ''],
      win: { winner: 'none', path: '' },
    })

    //filter words
    while(true){
      var word_info = gbdata.get_word();
      var word = word_info[0];
      var word_idx = word_info[1];

      if(!filter.includes(word_idx)){
        filter.push(word_idx);
        if(filter.length == gbdata.get_words_num())
          filter = []
        break;
      }
    }
    //用来random平民和卧底的词
    var word_rand = Math.round(Math.random());
    this.data.players = this.data.players.sort(function (){ Math.random() - 0.5});
    
    var iden_set = my_rand(this.data.players.length,this.data.UC+(this.data.baiban ? 1:0));
    //console.log(iden_set);

    for(var i = 0; i < this.data.players.length; i++){
      if(this.data.baiban && i == iden_set[1]){
        this.data.players[i].identity = 0;
        this.data.players[i].word = "白板";
        this.data.players[i].baiban += 1;
      }else if(i == iden_set[0]){
        this.data.players[i].identity = 1;
        this.data.players[i].word = word[1-word_rand];
        this.data.players[i].uc += 1;
      }else if(this.data.UC == 2 && i == iden_set[iden_set.length-1]){
        this.data.players[i].identity = 1;
        this.data.players[i].word = word[1-word_rand];
        this.data.players[i].uc += 1;
      }else{
        this.data.players[i].identity = 2;
        this.data.players[i].word = word[word_rand];
        this.data.players[i].pingmin += 1;
      }
    }

    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000 
    })
  }, 

  //查看词
  seeword: function (e) {
    //先发词
    if (!this.data.start) {
      wx.showToast({
        title: warn_word,
        image: warn_img,
        duration: 1000
      });
      return;
    }

    var id = e.currentTarget.dataset.id;
    var now_player;

    if(this.data.dead.includes(id)){
      wx.showToast({
        title: 'Dead',
        image: this.data.players[id].path,
        duration: 1000
      })
      return;
    }
    
    for (var i = 0; i < gbdata.globalData.player_num; i++){
      if(this.data.players[i].id == id){
        this.data.bgc[id] = '#EEA540';
        this.setData({
          bgc:this.data.bgc
        })
        now_player = this.data.players[id];
        break;
      }
    }

    wx.showToast({
      title: now_player.word,
      image: now_player.path,
      duration: 1000
    })

    // wx.showModal({
    //   title: now_player.name,
    //   content: now_player.word,
    //   showCancel: false,
    // })
  },

  //查看身份
  identity: function() {
    if(!this.data.start){
      wx.showToast({
        title: warn_word,
        image: warn_img,
        duration: 1000
      });
      return;
    }

    for(var i = 0; i < this.data.players.length; i++)
      this.data.display_iden[i] = this.data.identity ? this.data.players[i].identity : '';
    this.data.identity = !this.data.identity;
    this.setData({
      display_iden: this.data.display_iden,
    })
  },


  //投票
  vote: function () {
    if (!this.data.start) {
      wx.showToast({
        title: warn_word,
        image: warn_img,
        duration: 1000
      })
      return;
    }

    var names = [];
    var that = this;
    for (var i = 0; i < this.data.surviver.length; i++) {
      names.push(this.data.players[this.data.surviver[i]].name);
    }

    wx.showActionSheet({
      itemList: names,
      success: function (res) {
        if(!res.cancel){
          
          var sur_idx = that.data.surviver[res.tapIndex];
          that.data.bgc[sur_idx] = '#C1C1C1';
          that.data.dead.push(sur_idx);

          //dead + 1
          that.data.players[sur_idx].dead += 1;

          wx.showToast({
            title: '身份: ' + that.data.iden[that.data.players[sur_idx].identity],
            image: that.data.players[sur_idx].path,
            duration: 1000
          })

          
          that.data.display_iden[sur_idx] = that.data.players[sur_idx].identity;
          that.data.surviver.splice(res.tapIndex, 1);

          that.setData({
            bgc: that.data.bgc,
            display_iden: that.data.display_iden,
          })

          //判断是否胜利
          var pm_num = 0, uc_num = 0, bc_num = 0;
          var setdata = false;
          for (var i = 0; i < that.data.surviver.length; i++){
            switch(that.data.players[that.data.surviver[i]].identity){
              case 2:
                pm_num += 1;
                break;
              case 1:
                uc_num +=1;
                break;
              case 0:
                bc_num += 1;
                break;
            }
          }
          if(uc_num == 0 && bc_num > 0){
            // console.log('baiban win')
            that.data.win = {winner:'', path: img_path + 'bc.jpeg'};
            setdata = true;
            for (var i = 0; i < that.data.players.length; i++) {
              if (that.data.players[i].identity == 0){
                that.data.players[i].score += 1;
                break;
              }
            }
          }else if(uc_num == 0 && bc_num == 0 && pm_num > 0){
            // console.log('pingmin win')
            that.data.win = { winner: '', path: img_path + 'pm.jpeg' };
            setdata = true;
            for (var i = 0; i < that.data.players.length; i++) {
              if (that.data.players[i].identity == 2) {
                that.data.players[i].score += 1;
              }
            }
          }else if(uc_num > 0 && (pm_num + bc_num == 1)){
            // console.log('uc win')
            that.data.win = { winner: '', path: img_path + 'wd.jpeg' };
            setdata = true;
            for (var i = 0; i < that.data.players.length; i++) {
              if (that.data.players[i].identity == 1) {
                that.data.players[i].score += 1;
              }
            }
          }

          if (setdata){
            that.data.start = false;
            that.data.round += 1;
            for (var i = 0; i < that.data.players.length; i++)
              that.data.display_iden[i] = that.data.players[i].identity;
        

            that.setData({
              round: that.data.round,
              players: that.data.players,
              win: that.data.win,
              display_iden: that.data.display_iden,
              start: that.data.start,
            })
          }
        }
      }
      
    })

  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var player_num = gbdata.globalData.player_num
    var baiban = gbdata.globalData.baiban
    var survive = []
    for (var i = 0; i < player_num; i++)
      survive.push(i);

    this.setData({
      players: all_players.slice(0, player_num),
      baiban: baiban,
      UC: (player_num == 6) ? 2 : 1,
      surviver: survive
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
    return {
      imageUrl: '../../files/wd.jpeg'
    }
  }
})