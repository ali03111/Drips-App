import { call, put, select } from "redux-saga/effects";
import { onBack } from "../../navigation/RootNavigation";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import { updateBookingState } from "../actions/BookingActions";
import { updateStates as updateUserState } from "../actions/UserActions";
import { selectBooking } from "../selectors/bookingSelector";
import { selectUser } from "../selectors/userSelector";
import {
  applyJobApi,
  declineJobApi,
  deleteJobsApi,
  getJobsApi,
  hireApplierApi,
} from "../services/Services";

export function* getJobs({ payload }: any): any {
  const { page = 1 } = payload;
  const jobs: any = yield select((state: any) => state.BookingReducer.jobs);

  yield put(enableLoader());
  const response = yield call(getJobsApi, payload);
  yield put(disableLoader());
  if ("response" in response) {
    const { data, pagination } = response.response;
    if (page > 1) {
      yield put(
        updateBookingState({
          jobs: {
            data: [...jobs.data, ...data],
            pagination,
          },
        })
      );
    } else {
      yield put(
        updateBookingState({
          jobs: { data, pagination },
        })
      );
    }
  } else {
    errorHandler(response);
  }
}

export function* applyJob( { id }: any ): any {

  const booking: any = yield select( selectBooking );
  const user: any = yield select( selectUser );

  yield put( enableLoader() );
  const response = yield call( applyJobApi, id );
  yield put( disableLoader() );

  if( 'response' in response ){
    yield put(
      updateBookingState({
        booking: { ...booking, appliers: [ ...booking.appliers, user ] }
      })
    );
  } else {
    errorHandler(response)
  }
}

export function* revokeApply( { id }: any ): any {

  yield put( enableLoader() );
  const response = yield call( declineJobApi, id );
  yield put( disableLoader() );

  if( 'response' in response ){
    // yield put(
    //   updateBookingState({
    //     booking: { ...booking, status: payload.status }
    //   })
    // );
  } else {
    errorHandler(response)
  }
}

export function* hireApplier( { payload }: any ): any {

  yield put( enableLoader() );
  const response = yield call( hireApplierApi, payload );
  yield put( disableLoader() );

  if( 'response' in response ){
    const output = response.response.data;
    if (output.status != "succeeded" && output.redirect_url) {
      yield put(
        updateUserState({
          verification: {
            visible: true,
            url: output.redirect_url,
            type: "tip",
            data: output,
          },
        })
      );
    } else {
      yield put(showToast("Hired successfully"));
    }

    yield put(
      updateBookingState({ booking: { ...output.appointment } })
    );
  } else {
    errorHandler(response)
  }
}

export function* remove( { id }: any ): any {

  const jobs: any = yield select((state: any) => state.BookingReducer.jobs);

  yield put( enableLoader() );
  const response = yield call( deleteJobsApi, id );
  yield put( disableLoader() );
  if( 'response' in response ){

    yield put( 
      updateBookingState({
        jobs: {
          data: jobs.data.filter( ( job: any ) => job.id !== id ),
          pagination: jobs.pagination
        }
      }) 
    )

    onBack();
  } else {
    errorHandler(response)
  }
}
