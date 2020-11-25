import React from 'react'
import { Platform, Linking } from 'react-native'
import { connect } from 'react-redux'
import { useTheme } from 'styled-components'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import browsersList from 'assets/browsers'

const isHttps = /^(https?:\/\/)/
const isDocument = /\.(pdf|xlsx?|docx?|pptx?)($|\?)/

function Browser({ browser, fromBottom=false, onClose, readerMode, ...etc }) {
    const { color, background } = useTheme()

    React.useEffect(
        ()=>{
            let link = etc.link
            let internal = browser == 'internal'

            //non http(s) link
            if (!isHttps.test(link))
                internal = false
            //is document link, so open it in system android browser
            else if (Platform.OS == 'android' && isDocument.test(link))
                internal = false
            //find preferred external browser and rewrite url
            else
                for(const { id, prefix } of browsersList){
                    if (id == browser && prefix){
                        internal = false
                        link = link.replace(isHttps, prefix)
                        break
                    }
                }

            //open in internal browser
            if (internal)
                InAppBrowser.open(link, {
                    //android
                    toolbarColor: background.regular,
                    secondaryToolbarColor: background.alternative,
                    enableUrlBarHiding: true,
                    showTitle: true,
                    enableDefaultShare: true,
                    hasBackButton: true,

                    //ios
                    dismissButtonStyle: 'cancel',
                    modalEnabled: fromBottom,
                    animated: true,
                    preferredBarTintColor: background.regular,
                    preferredControlTintColor: color.accent,
                    enableBarCollapsing: true,
                    readerMode
                })
                    .then(()=>{
                        onClose(true)
                    })
                    .catch(onClose)
            else
                Linking.canOpenURL(link)
                    .then(supported=>{
                        onClose(supported)

                        if (supported)
                            return Linking.openURL(link)
                    })
                    .catch(onClose)
        },
        [etc.link]
    )

    return null
}

export default connect(
    (state, { browser })=>({
        browser: browser||state.local.browser
    })
)(Browser)