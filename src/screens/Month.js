import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { fonts } from "../assets/Styles";
import Banks from "../components/Banks";

const Month = (props) => {

  const [getMonthList, setGetMonthList] = useState([]);
  const [creditedList, setCreditedList] = useState([]);
  const [debitedList, setDebitedList] = useState([]);
  const [totalOfDebited, setTotalOfDebited] = useState(0);
  const [totalOfCredited, setTotalOfCredited] = useState(0);
  const [currentSelected, setCurrentSelected] = useState(0);

  const setDataInOrder = () => {
    var allmonthList = props?.route?.params?.data?.filter((ele, i) => moment(ele?.date).format('MMM') == props?.route?.params?.month)
    var debitedList = allmonthList.filter((ele, i) => ele?.type == 'DEBITED');
    var creditList = allmonthList.filter((ele, i) => ele?.type == 'CREDITED');

    var debitedTotal = 0;
    var creditedTotal = 0;

    allmonthList?.map((ele, i) => {
      if (ele?.type == 'DEBITED')
        debitedTotal += parseFloat(ele?.amount)
      else
        creditedTotal += parseFloat(ele?.amount)
    });
    setTotalOfCredited(creditedTotal);
    setTotalOfDebited(debitedTotal);
    setGetMonthList(allmonthList);
    setCreditedList(creditList);
    setDebitedList(debitedList);
  }

  useEffect(() => {
    //
    setDataInOrder()
  }, [])

  const _renderItems = ({ item, index }) => {
    if(item?.bank=='AXIS'){
      console.log(item);
    }
    return (
      <View style={{
        backgroundColor: 'white',
        padding: 15,
        width: Dimensions.get('window').width - 20,
        marginVertical: 5,
        marginHorizontal: 5,
        elevation: 5,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
      }}>
        <View>
          <Banks bankName={item?.bank?.toLowerCase()} />
        </View>
        
        <View>
          <Text
            style={{
              fontSize: 22,
              fontFamily:fonts.bold,
              color: item?.type == 'CREDITED' ? 'green' : 'red',
            }}>
              {item.amount} ₹
            </Text>
          {/* <Text style={{
            color: item?.type == 'CREDITED' ? 'green' : 'red'
          }}>{item?.type}</Text> */}
          <Text style={{
            fontFamily:fonts.regular,
            fontSize:12,
            marginTop:-5
          }}>
            {moment(item?.date).format('DD MMM YYYY')}
          </Text>
        </View>
      </View>
    )
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{
        alignItems: 'center',
        marginTop: 30
      }}>
        <Text style={{
          fontSize: 30,
        }}>{props?.route?.params?.month}</Text>
      </View>
      <View style={{
        marginHorizontal: 10,
        marginBottom: 30,
      }}>
        <Text style={{
          fontWeight: '200',
          fontFamily:fonts.medium,

        }}>Debited Amount: <Text style={{
          fontWeight: '800',
        }}>
            {totalOfDebited} ₹
          </Text></Text>

        <Text style={{
          fontWeight: '200',
        }}>Credited Amount: <Text style={{
          fontWeight: '800',
        }}>
            {totalOfCredited} ₹
          </Text></Text>
      </View>

      <View style={{
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 30
      }}>
        <TouchableOpacity
          onPress={() => setCurrentSelected(0)}
          style={{
            padding: 5,
            paddingHorizontal: 15,
            borderColor: 'gray',
            borderRadius: 40,
            borderWidth: 1,
            marginHorizontal: 10,
            backgroundColor: currentSelected == 0 ? 'gray' : '#fff',
          }}>
          <Text style={{
            color: currentSelected != 0 ? 'gray' : '#fff'
          }}>ALL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentSelected(1)}
          style={{
            padding: 5,
            paddingHorizontal: 15,
            borderColor: 'green',
            borderRadius: 40,
            borderWidth: 1,
            marginHorizontal: 10,
            backgroundColor: currentSelected == 1 ? 'green' : '#fff'
          }}>
          <Text style={{
            color: currentSelected != 1 ? 'green' : '#fff',
          }}>CREDITED</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentSelected(2)}
          style={{
            padding: 5,
            paddingHorizontal: 15,
            borderColor: 'red',
            borderRadius: 40,
            borderWidth: 1,
            marginHorizontal: 10,
            backgroundColor: currentSelected == 2 ? 'red' : '#fff'
          }}>
          <Text style={{
            color: currentSelected != 2 ? 'red' : '#fff'
          }}>DEBITED</Text>
        </TouchableOpacity>
      </View>

      {currentSelected == 0 ?
        <FlatList
          data={getMonthList}
          renderItem={_renderItems}
        /> : (
          currentSelected == 1 ?
            <FlatList
              data={creditedList}
              renderItem={_renderItems}
            /> :
            <FlatList
              data={debitedList}
              renderItem={_renderItems}
            />
        )}
    </View>
  )
}

export default Month;