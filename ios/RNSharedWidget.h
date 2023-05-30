//
//  RNSharedWidget.h
//  o2fitt
//
//  Created by oxygen on 5/21/23.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface  RNSharedWidget : NSObject<RCTBridgeModule>

@end
