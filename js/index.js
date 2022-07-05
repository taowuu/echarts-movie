/*
国家饼图
国家柱状图
类型词云图
评价条形图
*/
// 
// 国家统计
var countCountry = function(data) {
    // console.log(data)
    var countryDic = {}
    for(i = 0; i <data.length; i++) {
        // console.log(data[i].country)
        for(j = 0; j < data[i].country.length; j++) {
            // console.log(data[i].country[j])
            if(data[i].country[j] in countryDic) {
                countryDic[data[i].country[j]] += 1
            } else {
                countryDic[data[i].country[j]] = 1
            }
        }
    } 
    return countryDic   
}

// 类型统计
var countType = function(data) {
    // console.log(data)
    var TypeDic = {}
    for(i = 0; i <data.length; i++) {
        // console.log(data[i].type)
        for(j = 0; j < data[i].type.length; j++) {
            if(data[i].type[j] in TypeDic) {
                TypeDic[data[i].type[j]] += 1
            } else {
                TypeDic[data[i].type[j]] = 1
            }
            // console.log(data[i].type[j])
        }
    } 
    return TypeDic   
}


// 冒泡降序
var bubbleSort = function(arr) {
    var n = arr.length
    for(var i = 0; i < n-1; i++) {
      for(var j = 0; j < n-i-1; j++) {
        if(Number(arr[j].comments) < Number(arr[j+1].comments)) {
          var temp = arr[j]
          arr[j] = arr[j+1]
          arr[j+1] = temp
        }
      }
    }
    return arr
}

var mychart1 = echarts.init(document.getElementById('main1'));
$.get("data/movie250.json").done(function (data) {
    // var data = JSON.parse(data) 
    // console.log(data)
    var resOfCountry = countCountry(data)
    var x = []
    var y = []
    for(var key in resOfCountry) {
        x.push(key)
        y.push(resOfCountry[key])
    }
    // console.log(x)
    // console.log(y)
    // console.log(resOfCountry)
    mychart1.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: [
            {
              type: 'category',
              data: x,
              axisLabel: {
                rotate: -90
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '国家',
              type: 'bar',
              barWidth: '80%',
              data: y
            }
          ]
    })
})

var mychart2 = echarts.init(document.getElementById('main2'));
$.get("data/movie250.json").done(function (data) {
    // var data = JSON.parse(data) 
    // console.log(data)
    var resOfCountry = countCountry(data)
    var res = []
    var o = {}
    for(var key in resOfCountry) {
        o['name'] = key
        o['value'] = resOfCountry[key]
        res.push(o)
        o = {}
    }
    console.log('pie ',res)
    mychart2.setOption({
        title: {
            text: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '国家',
              type: 'pie',
              radius: '55%',
              data: res,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
    })
})

echarts.connect([mychart1,mychart2])

mychart1.on('mouseover',e=>{
  // console.log(e)
  mychart2.dispatchAction({
        type:'highlight',
        dataIndex:e.dataIndex
  })
})
mychart1.on('click',e=>{
  // console.log(e)
  mychart2.dispatchAction({
        type:'showTip',
        seriesIndex:0,
        dataIndex:e.dataIndex
  })
})
mychart1.on('mouseout',e=>{
      mychart2.dispatchAction({
          type:'downplay',
          dataIndex:e.dataIndex
    })
})

var mychart3 = echarts.init(document.getElementById('main3'));
$.get("data/movie250.json").done(function (data) {
    // var data = JSON.parse(data) 
    // console.log(data)
    
    // var res = data.sort(function (a, b) {
    //   // console.log(a)
    //   // console.log(b)
    //   return Number(b.comments) - Number(a.comments);
    // })
    var res = bubbleSort(data)
    // console.log(res.slice(0,10))
    var y = []
    var val = []
    for(var i of res.slice(0,10)) {
      // console.log(i.name)
      y.unshift(i.name)
      // console.log(i.comments)
      val.unshift(i.comments)
    }
    // console.log(y)
    // console.log(val)
    mychart3.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      label: {
        show: true,
        position: 'right'
      },
      legend: {},
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: y
      },
      series: [
        {
          type: 'bar',
          name: '电影名称',
          data: val
        }
      ]   
    })
})

var mychart4 = echarts.init(document.getElementById('main4'));
$.get("data/movie250.json").done(function (data) {
    // data = JSON.parse(data);
    var resOfType = countType(data)
    var res = []
    var o = {}
    for(var key in resOfType) {
        o['value'] = resOfType[key]
        o['name'] = key
        res.push(o)
        o = {}
    }
    console.log('word ',res)
    var option = {
        tooltip : {
            trigger: 'item',
            formatter:function(item){
                return item.name + "：" + item.value
            }
        },
        series: [ {
            type: 'wordCloud',
            sizeRange: [50,100],
            rotationRange: [0, 0],
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                    // rgb(72,108,79)
                },
                emphasis: {
                    shadowBlur: 26,
                    color:'red',
                    shadowColor: '#ccc',
                    fontSize:100
                }
            },
            data: res
        } ]
    }
    mychart4.setOption(option)
})