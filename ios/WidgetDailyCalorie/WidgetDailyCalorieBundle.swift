//
//  WidgetDailyCalorieBundle.swift
//  WidgetDailyCalorie
//
//  Created by oxygen on 5/20/23.
//

import WidgetKit
import SwiftUI

@main
struct WidgetDailyCalorieBundle: WidgetBundle {
    var body: some Widget {
        WidgetDailyCalorie()
        WidgetDailyCalorieLiveActivity()
    }
}
