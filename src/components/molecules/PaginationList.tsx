import React, { useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import { COLORS } from "../../constants";
import { EmptyList, Typography } from "../atoms";

export const PaginationList = (props: any) => {

    const {
      data,
      pagination,
      renderItem,
      action,
      params,
      pullToRefresh = true,
    } = props;
  
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = React.useState(false);
    const [load, setLoad] = React.useState(false);
  
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      dispatch( action( params ) );
    }, [data]);
  
    useEffect(() => {
      setRefreshing(false);
      setLoad(false);
    }, [data]);
  
    const loadMore = () => {
      if (pagination.current_page < pagination.total_pages) {
        setLoad(true);
        dispatch( action({ ...params, page: pagination.current_page + 1 }));
      } else {
        setLoad(false);
      }
    };
  
    const footerComponent = () => {
      if (pagination.current_page == pagination.total_pages && data.length > 0 && pagination.current_page > 1) {
        return (
          <Typography
            textType="light"
            align="center"
            style={{ paddingBottom: 40, paddingTop: 10, backgroundColor: '#fff' }}
            color={COLORS.darkGray}
          >
            {" "}
            End Reached
          </Typography>
        );
      }
      if (!load) return null;
      return <View style={{ height: 100, paddingTop: 10 }}>
        <ActivityIndicator color={"#000"} size={"small"} />
      </View>;
    };
    
    return (
      <FlatList
        { ...props }
        data={ data }
        renderItem={ renderItem }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          pullToRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={ () => <EmptyList /> }
        ListFooterComponent={ () => footerComponent()}
        onEndReachedThreshold={0}
        onEndReached={loadMore}
      />
    )
  }