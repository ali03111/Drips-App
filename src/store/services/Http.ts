import store from "..";
import { BASEURL } from "../../constants";
import { serialize } from "../../utils/utils";

const request = (
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  endpoint: string,
  params: any = {},
  headers: any = {},
  formData: any = false
) => {

  const { token } = store.getState().UserReducer;

  if( token ) headers['Authorization'] = `Bearer ${token}`;
  if( !formData ) {
    headers['Content-Type'] = 'application/json';
  }else{
    headers['Content-Type'] = 'multipart/form-data';
    // const formData = new FormData();
    // for( let key in params ){
    //   formData.append(key, params[key]);
    // }

    // params = formData;
  };

  let url: string = `${BASEURL}${endpoint}`;
  const config = {
    method,
    headers: {
      'Accept': 'application/json',
      ...headers
    },
    body: params
  }

  if( method === 'get' ) {
    if( Object.keys(params).length > 0 ) url = url.concat( `?${ serialize( params ) }` );
    delete( config.body );
  };

  return fetch(url, config)
  .then( res => res.json() )
  .then( res => res )
  .catch( err => {
    return err;
  } );
};

export const get = (url: string, params = {}, headers: any = {} ) =>
  request('get', url, params, headers);

export const post = (url: string, params = {}, headers: any = {}, formData: any = false ) =>
  request('post', url, params, headers, formData);

export const deleting = (url: string, params = {}, headers: any = {} ) =>
  request('delete', url, params, headers);

