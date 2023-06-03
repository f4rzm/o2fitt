//
//  WidgetDailyCalorieLiveActivity.swift
//  WidgetDailyCalorie
//
//  Created by oxygen on 5/20/23.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetDailyCalorieAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var value: Int
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct WidgetDailyCalorieLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: WidgetDailyCalorieAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)
            
        }
    }
}
