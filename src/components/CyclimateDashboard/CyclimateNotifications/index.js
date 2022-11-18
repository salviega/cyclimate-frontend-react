import React from 'react'
import { NotificationItem } from '@pushprotocol/uiweb'

export function CyclimateNotifications ({ notifications }) {
  return (
    <>
      {notifications?.map((oneNotification, index) => {
        const {
          cta,
          title,
          message,
          app,
          icon,
          image,
          url,
          blockchain,
          notification
        } = oneNotification

        return (
          <NotificationItem
            key={index}
            notificationTitle={title}
            notificationBody={message}
            cta={cta}
            app={app}
            icon={icon}
            image={image}
            url={url}
            theme='dark'
            chainName={blockchain}
            notification={notification}
          />
        )
      })}
      ;
    </>
  )
}
