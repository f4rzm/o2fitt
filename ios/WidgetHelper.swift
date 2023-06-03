//
//  WidgetHelper.swift
//  o2fitt
//
//  Created by oxygen on 5/21/23.
//

import WidgetKit

@available(iOS 15, *)
@objcMembers final class WidgetKitHelper: NSObject {
  
  class func reloadAllTimelines() {
#if arch(arm64) || arch(i386) || arch(x86_64)
    WidgetCenter.shared.reloadAllTimelines()
#endif
  }
}
