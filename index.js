var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

app = express();

app.get('/chinaz', function (req, res, next) {
  var items = [];
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('http://del.chinaz.com/')
    .query({
      kw:'',
      p:'0',
      domainType:'1',
      date:'1',
      pyType:'3',
      bl:'5',
      el:'10',
      pro:'全',
      xz:'全部',
      'ds[]':'1',
      'suffix[]':'com',
      cn_txt:'',
      Sort:'3',
      isall:'0'
    })
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);

      $('.ResultListWrap .li_tag').each(function (idx, element) {
        var $element = $(element);
        items.push({
          name: $element.find('.w200').find('a').text(),
          length: $element.find('.w50').eq(0).text(),
          url: $element.find('.w200').find('a').attr('href')
        });
      });
      console.log(items);
      res.send(items);
    });

});


app.get('/discount', function (req, res, next) {
  var items = [];
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('http://appstore-discounts.com/list.php')
    .query({
      sort:'appFree'
    })
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);

      $('.product-grid > div').each(function (idx, element) {
        var $element = $(element);
        if ($element.hasClass('adsGrid')) {
          console.log('get the ad');
        } else {
          items.push({
            name: $element.find('.name').text(),
            price: $element.find('.price').text(),
            newFromeDate: $element.find('.newFromDate').text(),
            category: $element.find('.category').text(),
            icon: $element.find('.image').find('img').attr('src'),
            url: $element.find('.cart').find('input').eq(1).attr('onclick')
          });
        }
      });
      console.log(items);
      res.send(items);
    });

});


app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});