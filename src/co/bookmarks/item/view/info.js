import React from 'react'
import { View } from 'react-native'
import _ from 'lodash-es'
import CollectionContainer from './collection'
import {
	styles,
	ItemTitle,
	ItemTags,
	ItemDescription,
	ItemSubinfo
} from 'co/style/item'
import { TypeIcon } from './style'
import { ShortDate } from 'modules/format/date'
import { getDetails } from 'co/filters/item'

const removeEmRegex = /<\/{0,1}em>/g
const removeEm = (body='')=>_.unescape(body.replace(removeEmRegex, ''))

const SpaceItemInfo = ({ item, highlight, spaceId, view, onCollectionPress, viewHide })=>{
	const { title, excerpt, type, tags, domain, broken, duplicate, important, collectionId, created } = item

	return (<>
		{!viewHide.includes('title') && (
			<ItemTitle 
				bold={true} 
				numberOfLines={2}>
				{title}
			</ItemTitle>
		)}

		{!!excerpt && !viewHide.includes('excerpt') && (
			<View style={styles.footer}>
				<ItemDescription numberOfLines={5}>
					{excerpt}
				</ItemDescription>
			</View>
		)}

		{!!highlight.body && (
			<View style={styles.body}>
				<ItemDescription numberOfLines={4}>
					{removeEm(highlight.body)}
				</ItemDescription>
			</View>
		)}

		{!!tags && !viewHide.includes('tags') && (
			<View style={styles.footer}>
				<ItemTags numberOfLines={4}>
					{tags}
				</ItemTags>
			</View>
		)}

		{!viewHide.includes('info') && (
			<View style={styles.footer}>
				{!!important && <TypeIcon name={getDetails('important').icon} color='important' variant='fill' size={16} />}
				{!!broken && <TypeIcon name={getDetails('broken').icon} color='broken' variant='fill' size={16}  />}
				{!!duplicate && <TypeIcon name={getDetails('duplicate').icon} color='duplicate' variant='fill' size={16}  />}
				{type!='link' && <TypeIcon name={getDetails(type).icon} variant='fill' size={16} />}
				<ItemSubinfo numberOfLines={1}>{domain}  ·  <ShortDate date={created} /></ItemSubinfo>
			</View>
		)}

		{item.collectionId != spaceId && (
			<View style={styles.footer} key='collectionPath'>
				<CollectionContainer collectionId={collectionId} onPress={onCollectionPress} />
			</View>
		)}
	</>)
}

export default SpaceItemInfo