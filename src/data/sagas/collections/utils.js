import { select } from 'redux-saga/effects'
import ApiError from '../../modules/error'

export function* userIsPro() {
	const state = yield select()
	return (state.user.current.pro ? true : false)
}

export function* onlyForProUsersCheck() {
	const isPro = yield userIsPro()
	if (!isPro)
		throw new ApiError({ status: 403, errorMessage: 'needProAccount' })
}