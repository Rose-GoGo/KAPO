import MyHttp from './request.js';
//所有的请求
const ALL_API = {
  all: { //全部文章
    method: 'POST',
    url: '/index.php?m=content&c=api&a=index'
  },
  hits: { //top10
    method: 'POST',
    url: '/index.php?m=content&c=api&a=hits'
  },
  lists: { //分类文章
    method: 'POST',
    url: '/index.php?m=content&c=api&a=lists'
  },
  pageitem: { //详情
    method: 'POST',
    url: '/index.php?m=content&c=api&a=show'
  },
  showday: { //时间轴
    method: 'POST',
    url: '/index.php?m=content&c=punch&a=lists'
  },
  everyadd: { //打卡添加
    method: 'POST',
    url: '/index.php?m=content&c=punch&a=add'
  },
  everyupdate: { //打卡编辑
    method: 'POST',
    url: '/index.php?m=content&c=punch&a=update'
  },
  everydelete: { //打卡删除
    method: 'POST',
    url: '/index.php?m=content&c=punch&a=delete'
  },
  feedback: { //意见反馈
    method: 'POST',
    url: '/index.php?m=content&c=punch&a=feedback'
  }
}
const Api = new MyHttp({}, ALL_API);

export default Api;
