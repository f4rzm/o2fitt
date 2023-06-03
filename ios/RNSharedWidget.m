//
//  RNSharedWidget.m
//  o2fitt
//
//  Created by oxygen on 5/20/23.
//

#import <Foundation/Foundation.h>
#import "RNSharedWidget.h"
#import "O2fitt-Swift.h"

@implementation RNSharedWidget

NSUserDefaults *sharedDefaults;
NSString *appGroup = @"group.o2fitt";

-(dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(RNSharedWidget)

RCT_EXPORT_METHOD(setData: (NSString *)key: (NSString * )data: (RCTResponseSenderBlock)callback) {
  
  sharedDefaults = [[NSUserDefaults  alloc]initWithSuiteName:appGroup];
  
  if(sharedDefaults == nil) {
    callback(@[@0]);
    return;
  }
  
  [sharedDefaults setValue:data forKey:key];
  if (@available(iOS 15, *)) {
    [WidgetKitHelper reloadAllTimelines];
  } else {
      // Fallback on earlier versions
  }
  callback(@[[NSNull null]]);
}

@end
