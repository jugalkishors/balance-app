import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Dimensions, Image } from "react-native";
import SmsAndroid from 'react-native-get-sms-android';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { colors, fonts } from "../assets/Styles";
import Banks from "../components/Banks";

const { width, height } = Dimensions.get('window');
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

const Home = (props) => {
  var curDate = new Date();

  const [msgList, setMsgList] = useState([]);
  const [state, setState] = useState({
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  });
  const [detectedBanks, setDetectedBanks] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        data: [
          state.Jan,
          state.Feb,
          state.Mar,
          state.Apr,
          state.May,
          state.Jun,
          state.Jul,
          state.Aug,
          state.Sep,
          state.Oct,
          state.Nov,
          state.Dec,
        ],
        color: (opacity = 1) => colors.themeColor, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ['Spent Amount'] // optional
  };


  var filter = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
    read: 1, // 0 for unread SMS, 1 for SMS already read

  };

  var filter1 = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
    read: 0, // 0 for unread SMS, 1 for SMS already read

  }

  const _renderItems = ({ item, index }) => {
    return (
      <View style={{
        backgroundColor: 'white',
        padding: 15,
        width: Dimensions.get('window').width - 20,
        marginVertical: 5,
        marginHorizontal: 5,
        elevation: 5,
        borderRadius: 10,
      }}>
        <Text>{item.bank}</Text>
        <Text
          style={{
            fontSize: 22
          }}>{item.amount}</Text>
        <Text style={{
          color: item?.type == 'CREDITED' ? 'green' : 'red'
        }}>{item?.type}</Text>
        <Text>{new Date(parseInt(item?.date)).toISOString()}</Text>
      </View>
    )
  }

  const renderSpentAmount = (ele, i) => {
    if (parseInt(state[ele]) > 0) {
    return (
      <View style={{
        width: width / 2.2,
      }}>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('Month', {
            data: msgList,
            month: ele,
          })}
          style={{
            backgroundColor: '#fff',
            marginHorizontal: 10,
            marginVertical: 5,
            // width:width/2.6,
            alignItems: 'center',
            padding: 10,
            elevation: 5,
            borderRadius: 10,
          }}>
          <Text style={{
          }}>{ele}</Text>
          <Text style={{
            fontWeight: '700',
          }}>{state[ele]?.toFixed(2)} ₹</Text>
        </TouchableOpacity>
      </View>
    )
        }
  }

  const avgExpense = ()=>{
    var amt = 0;
    monthExpenses?.map((item, index)=>{
      amt+=parseFloat(state[item]);
    })
    return amt;
  }

  useEffect(() => {
    var unreadSms = [];

    SmsAndroid.list(
      JSON.stringify(filter1),
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        var arr = JSON.parse(smsList);
        unreadSms = arr;
      },
    );

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        var arr = JSON.parse(smsList);

        var selectedMsg = [];
        const terms = ['HDFC', 'RS', 'DEBITED'];
        const sbiTerm = ['SBI', 'DEAR', 'USER'];
        const axisTerm = ['AXIS', 'BANK', 'INR'];
        const iciciTerm = ['ICICI', 'BANK', 'RS'];
        const pnbTerm = ['YOUR', 'NO', 'PNB', 'RS', 'CREDITED']

        var newArr = arr.concat(unreadSms)

        newArr.sort((a, b) => a.date < b.date ? 1 : -1);

        var todayYear = curDate.getFullYear();
        var bankList = [];

        newArr?.map((item, index) => {

          if(item?.address=='+919649215382')
            console.log('ite,,,', item)

          if (terms.every(term => item?.body.split('@')[0]?.toUpperCase()?.includes(term))) {
            selectedMsg.push({
              type: item?.body?.toUpperCase()?.split('RS ')[1].split(" ")[1]?.split(" ")[0],
              date: item?.date,
              bank: 'HDFC',
              amount: item?.body?.toUpperCase().split('RS ')[1].split(" ")[0]
            });

            if(!bankList.includes('hdfc'))  bankList.push('hdfc');

            if (moment(item?.date).format('Y') == todayYear) {
              if (item?.body?.toUpperCase()?.split('RS ')[1].split(" ")[1]?.split(" ")[0] == 'DEBITED') {
                state[moment(item?.date).format('MMM')] += parseFloat(item?.body?.toUpperCase().split('RS ')[1].split(" ")[0])
              } else {
                state[moment(item?.date).format('MMM')] -= parseFloat(item?.body?.toUpperCase().split('RS ')[1].split(" ")[0])
              }
            }
          }

          if (iciciTerm.every(term => item?.body.split('@')[0]?.toUpperCase()?.includes(term))) {
            selectedMsg.push({
              type: item?.body?.toUpperCase()?.split(' FOR RS')[0].split(" ")?.pop(),
              date: item?.date,
              bank: 'ICICI',
              amount: item?.body?.toUpperCase().split('RS ')[1].split(" ")[0]
            });

            if(!bankList.includes('icici'))  bankList.push('icici');

            if (moment(item?.date).format('Y') == todayYear) {
              if (item?.body?.toUpperCase()?.split('RS ')[1].split(" ")[1]?.split(" ")[0] == 'DEBITED') {
                state[moment(item?.date).format('MMM')] += parseFloat(item?.body?.toUpperCase().split('RS ')[1].split(" ")[0])
              } else {
                state[moment(item?.date).format('MMM')] -= parseFloat(item?.body?.toUpperCase().split('RS ')[1].split(" ")[0])
              }
            }
          }


          else if (pnbTerm.every(term => item?.body.split('@')[0]?.toUpperCase()?.includes(term))) {
            selectedMsg.push({
              type: item?.body?.toUpperCase()?.split('IS ')[1].split(" ")[0],
              date: item?.date,
              bank: 'PNB',
              amount: item?.body?.toUpperCase().split('RS ')[1].split(" ")[0],
            });

            if(!bankList.includes('pnb'))  bankList.push('pnb');

            if (moment(item?.date).format('Y') == todayYear) {
              if (item?.body?.toUpperCase()?.split('IS ')[1].split(" ")[0] == 'DEBITED') {
                state[moment(item?.date).format('MMM')] += parseFloat(item?.body?.toUpperCase().split('RS ')[1].split(" ")[0])
              } else {
                state[moment(item?.date).format('MMM')] -= parseFloat(item?.body?.toUpperCase().split('RS ')[1].split(" ")[0])
              }
            }
          }

          else if (sbiTerm.every(term => item?.body?.toUpperCase()?.includes(term))) {
            var amtType = item?.body?.toUpperCase()?.split(' BY')[0]?.split(' ')?.pop();

            selectedMsg.push({
              type: amtType?.includes('-') ? amtType.split('-')[1] : amtType,
              date: item?.date,
              bank: 'SBI',
              amount: item?.body?.toUpperCase().split('RS')[1].split(" ")[0]
            });

            if(!bankList.includes('sbi'))  bankList.push('sbi');

            if (moment(item?.date).format('Y') == todayYear) {
              if ((amtType?.includes('-') ? amtType.split('-')[1] : amtType) == 'DEBITED') {
                state[moment(item?.date).format('MMM')] += parseFloat(item?.body?.toUpperCase().split('RS')[1].split(" ")[0])
              } else {
                state[moment(item?.date).format('MMM')] -= parseFloat(item?.body?.toUpperCase().split('RS')[1].split(" ")[0])
              }
            }
          }

          else if (axisTerm.every(term => item?.body.split('@')[0]?.toUpperCase()?.includes(term))) {
            selectedMsg.push({
              type: item?.body?.toUpperCase()?.split('INR ')[1]?.split(' ')[1],
              date: item?.date,
              bank: 'AXIS',
              amount: item?.body?.toUpperCase()?.split('INR ')[1].split(" ")[0]?.split('\n')?.[0]
            });

            if(!bankList.includes('axis'))  bankList.push('axis');

            if (moment(item?.date).format('Y') == todayYear) {
              if (item?.body?.toUpperCase()?.split('INR ')[1]?.split(' ')[1] == 'DEBITED') {
                state[moment(item?.date).format('MMM')] += parseFloat(item?.body?.toUpperCase()?.split('INR ')[1].split(" ")[0])
              } else {
                state[moment(item?.date).format('MMM')] -= parseFloat(item?.body?.toUpperCase()?.split('INR ')[1].split(" ")[0])
              }
            }
          }
        })
        //
        setDetectedBanks(bankList);
        setMonthExpenses(data?.labels?.filter((ele, i)=>parseInt(state[ele]) > 0));
        setMsgList(selectedMsg);
        // arr.forEach(function(object) {
        //   console.log('Object: ' + object);
        //   console.log('-->' + object.date);
        //   console.log('-->' + object.body);
        // });
      },
    );
  }, [])

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'white',
      // justifyContent: 'center',
      // alignItems: 'center',
    }}>

      <View style={{
        // backgroundColor:'red',
        paddingVertical: 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Text style={{
          fontFamily: fonts.bold,
          fontSize: 25
        }}>Dashboard</Text>

        <View>
          <Image
            source={{ uri: 'https://img.freepik.com/free-vector/indian-rupee-money-bag_23-2147993757.jpg?w=996&t=st=1668667601~exp=1668668201~hmac=c2fa63134509da62cf6a3b4ca7688a8f35e43c5eddd192f2d6ecf3bfe5c19e91' }}
            style={{
              height: 40,
              width: 40,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: colors.themeColor
            }}
          />
        </View>
      </View>

      <View style={{
        marginLeft: 10,
      }}>
        <LineChart
          data={data}
          width={width - 10}
          height={220}

          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientTo: "white",
            backgroundGradientFromOpacity: 0,
            backgroundGradientFrom: "white",
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => '#000',
            labelColor: (opacity = 1) => '#000000',
            barPercentage: 0.13,
            barRadius: 5,
            propsForLabels: {
              fontSize: "10",
              fill: "rgba(10, 10, 10, 1)",
              fontWeight: 100,
              padding: 5
            },
          }}
          yAxisLabel={'₹ '}
          withDots={true}
          withHorizontalLines={true}
          withHorizontalLabels={true}
          fromZero={true}
          withCustomBarColorFromData={true}
          flatColor={true}
          withInnerLines={true}
          xLabelsOffset={1}
          // yLabelsOffset={5}
          showBarTops={false}
          showValuesOnTopOfBars={false}
        />
      </View>

      <View style={{
        marginHorizontal:20,
        marginVertical:20,
        flexDirection:'row',
        alignItems:'center',
      }}>
        <Text style={{
          fontFamily:fonts.regular,
          fontSize:14,
          color:'#000',
          marginHorizontal:10
        }}>Average{'\n'}Expenses:</Text>
        <View>
        <Text style={{
          fontFamily:fonts.semiBold,
          fontSize:22,
          color:'#000'
        }}>{avgExpense()}<Text style={{
          fontSize:12,
          fontFamily:fonts.regular
        }}> /Month</Text> ₹</Text>
        <Text style={{
          fontFamily:fonts.medium,
          fontSize:12,
          color:'#000',
          marginTop:-10
        }}>{(avgExpense()/30.5).toFixed(2)}<Text style={{
          fontSize:8,
          fontFamily:fonts.regular
        }}> /Day</Text> ₹</Text>
        </View>
      </View>

      <View>
        <Text style={{
          fontFamily:fonts.medium,
          fontSize:16,
          marginHorizontal:15,
          color:'#000'
        }}>
          Detected Banks
        </Text>
        <FlatList
        style={{marginLeft:10,marginBottom:13}}
        data={detectedBanks}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index})=>{
          return(
            <Banks bankName={item} />
          )
        }}
        />
      </View>

      <View style={{
        marginVertical: 10,
        marginHorizontal: 15,
        // flexWrap: 'wrap',
        // alignItems: 'center'
        flex:1
      }}>

        <FlatList
        style={{
          flex:1
        }}
          data={monthExpenses}
          numColumns={2}
          scrollEnabled={true}
          renderItem={({ item, index }) => renderSpentAmount(item, index)}
        />
      </View>


      {/* <FlatList
        data={msgList}
        renderItem={_renderItems}
      /> */}
    </View>
  )
}

export default Home;