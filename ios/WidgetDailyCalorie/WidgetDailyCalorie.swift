import WidgetKit
import SwiftUI
import Intents
import Charts


struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      let valuesData:ReactValue=ReactValue(dailyPro: 216, dailyCarb: 187, DailyFat: 191, dailyCalorie: 2560, pro: 95, carbo: 160, fat: 120, calorie: 1897,dailyCaloriePercent: 0.6,dailyWater: 8,drinkedWater: 5,dailyPedometer: 5000,pedometer: 2450,dietProgress: 36,hasCredit: true)
      return SimpleEntry(date: Date(), configuration: ConfigurationIntent(), data: valuesData)
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      let valuesData:ReactValue=ReactValue(dailyPro: 216, dailyCarb: 187, DailyFat: 191, dailyCalorie: 2560, pro: 95, carbo: 160, fat: 120, calorie: 1897,dailyCaloriePercent: 0.6,dailyWater: 8,drinkedWater: 5,dailyPedometer: 5000,pedometer: 2450,dietProgress: 36,hasCredit: true)
      let entry = SimpleEntry(date: Date(), configuration: configuration,data: valuesData)
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
      let userDfaults = UserDefaults.init(suiteName: "group.o2fitt")
      let jsonText = userDfaults!.value(forKey: "convertorO2fitt") as? String
      let jsonData = Data(jsonText?.utf8 ?? "".utf8)
      let valuesData = try! JSONDecoder().decode(ReactValue.self, from: jsonData)
    

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
          let entry = SimpleEntry(date: entryDate, configuration: configuration, data: valuesData)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}
struct ValuesData:Codable{
  let date:String
  let calorie:Int
}
struct ReactValue:Codable{
  let dailyPro:Float
  let dailyCarb:Float
  let DailyFat:Float
  let dailyCalorie:Int
  let pro:Float
  let carbo:Float
  let fat:Float
  let calorie:Int
  let dailyCaloriePercent:Double
  let dailyWater:Double
  let drinkedWater:Double
  let dailyPedometer:Int
  let pedometer:Int
  let dietProgress:Int
  let hasCredit:Bool
}

struct SimpleEntry: TimelineEntry {
   let date: Date
   let configuration: ConfigurationIntent
   let data: ReactValue
}

struct CircularProgressView: View {
  @State var userData:ReactValue
  let progress: Double
 
  var body: some View {
        
    ZStack{
      Circle()
          .stroke(
              Color.pink.opacity(0.5),
              lineWidth: 11
          )
      Text("Today calorie\n\(userData.dailyCalorie)")
      .font(.system(size:22))
      .bold()
      .multilineTextAlignment(.center)
      .frame(width: 100)
      
          
      Circle()
        .trim(from: 0, to: userData.dailyCaloriePercent)
        .stroke(
              Color.pink,
              style: StrokeStyle(
                  lineWidth: 11,
                  lineCap: .round
              )
          )
          .rotationEffect(.degrees(-90))
          // 1
          .animation(.easeOut, value: userData.dailyCaloriePercent)
      if(userData.dailyCaloriePercent<=1){
        Circle()
          .trim(from: 0, to: userData.dailyCaloriePercent)
          .stroke(
                Color.green,
                style: StrokeStyle(
                    lineWidth: 11,
                    lineCap: .round
                )
            )
            .rotationEffect(.degrees(-90))
            // 1
            .animation(.easeOut, value: userData.dailyCaloriePercent)
      }else{
        Circle()
          .trim(from: 0, to: userData.dailyCaloriePercent)
          .stroke(
                Color.red,
                style: StrokeStyle(
                    lineWidth: 11,
                    lineCap: .round
                )
            )
            .rotationEffect(.degrees(-90))
            // 1
            .animation(.easeOut, value: userData.dailyCaloriePercent)
      }
        
          }.padding(10)
        
      }
}
struct ToyShape: Identifiable {
    var type: String
    var count: Double
    var id = UUID()
}

struct MediumWidgetView: View {
  
  @State var userData:ReactValue
  let progress: Double
  
      var body: some View {
        HStack{
        ZStack{
          Circle()
              .stroke(
                Color.gray.opacity(0.6),
                  lineWidth: 8
              )
          Text("\(userData.calorie) / \(userData.dailyCalorie)\nCalorie")
          .font(.system(size:15))
          .bold()
          .multilineTextAlignment(.center)
          .frame(width: 100)
          
              
          Circle()
            .trim(from: 0, to: userData.dailyCaloriePercent)
            .stroke(
                  Color.pink,
                  style: StrokeStyle(
                      lineWidth: 8,
                      lineCap: .round
                  )
              )
              .rotationEffect(.degrees(-90))
              // 1
              .animation(.easeOut, value: userData.dailyCaloriePercent)
          if(userData.dailyCaloriePercent<=1){
            Circle()
              .trim(from: 0, to: userData.dailyCaloriePercent)
              .stroke(
                Color.orange.gradient,
                    style: StrokeStyle(
                        lineWidth: 8,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                // 1
                .animation(.easeOut, value: userData.dailyCaloriePercent)
          }else{
            Circle()
              .trim(from: 0, to: userData.dailyCaloriePercent)
              .stroke(
                    Color.red,
                    style: StrokeStyle(
                        lineWidth: 8,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                // 1
                .animation(.easeOut, value: userData.dailyCaloriePercent)
          }
            
        }.frame(width: 130)
          VStack(alignment: .leading){
            Spacer()
            HStack{
              Text("Carbohydrate")
                .font(.footnote)
              Spacer()
              Text("\(Int(userData.carbo)) /")
                .font(.caption)
              Text("\(Int(userData.dailyCarb))g")
                .font(.caption)
                .bold()
            }
            
            ProgressView( value: userData.carbo, total: userData.dailyCarb)
              .scaleEffect(x: 1, y: 1.5, anchor: .center)
              .tint(Color.red.gradient)
              
            Spacer()
           
            HStack{
              Text("Protein")
                .font(.footnote)
              Spacer()
              Text("\(Int(userData.pro)) /")
                .font(.caption)
              Text("\(Int(userData.dailyPro))g")
                .font(.caption)
                .bold()
            }
            ProgressView( value:userData.pro , total: userData.dailyPro)
              .scaleEffect(x: 1, y: 1.5, anchor: .center)
              .tint(.green)
           
            Spacer()
            HStack(alignment: .firstTextBaseline){
              Text("Fat")
                .font(.footnote)
              Spacer()
              Text("\(Int(userData.fat)) /")
                .font(.caption)
              Text("\(Int(userData.DailyFat))g")
                .font(.caption)
                .bold()
            }
           
            ProgressView( value: userData.fat, total: userData.DailyFat)
              .scaleEffect(x: 1, y: 1.5, anchor: .center)
              .tint(Color.blue.gradient)
            Spacer()
            
          }.padding(.leading,20)
          
        }.padding(10)
        
      }
}
struct LargeWidgetView: View {
  
  @State var userData:ReactValue
  let progress: Double
  
      var body: some View {
        VStack{
          MediumWidgetView(userData: userData, progress: progress)
          HStack(alignment: .center){
            Spacer()
            VStack{
              Image("glass")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .padding()
                .frame(width: 30,height: 90)
              Text("glass\n\(userData.drinkedWater,specifier: "%.1f") / \(userData.dailyWater,specifier: "%.1f")")
                .font(.footnote)
                .multilineTextAlignment(.center)

              
            }.frame(maxWidth: 200)
            Spacer()
            VStack{
              Image("diet")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .padding()
                .frame(width: 30,height: 90)
              Text("Diet Progress\n\(userData.dietProgress)%")
                .font(.footnote)
                .multilineTextAlignment(.center)

            }.frame(maxWidth: 200)
            Spacer()
            VStack(){
              Image("pedometer")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .padding()
                .frame(width: 30,height: 90)
              Text("pedometer\n\(userData.pedometer) / \(userData.dailyPedometer)")
                .font(.footnote)
                .multilineTextAlignment(.center)
              
            }.frame(maxWidth: 200)
            Spacer()
          }.padding(.init(top: 0, leading: 0, bottom: 30, trailing: 0))
        }
      }
}

struct WidgetDailyCalorieEntryView : View {
  var entry: Provider.Entry
  @Environment(\.widgetFamily) var family
  @State var progress: Double = 0.7
  
  var body: some View {
    switch family{
    case .systemSmall:
          ZStack {
//            ContainerRelativeShape()
            CircularProgressView(userData:entry.data,progress: progress)
          }
    case .systemMedium:
      ZStack {
//        ContainerRelativeShape()
//          .fill(.gray.gradient)
        MediumWidgetView(userData:entry.data,progress: progress)
      }
      
      
    case .systemLarge:
      ZStack{
        LargeWidgetView(userData:entry.data,progress: progress)
      }
      
      
    default:
      Text("no imopaler")
    }
//    ZStack {
//      ContainerRelativeShape()
//        .fill(.orange.gradient)
//      CircularProgressView(progress: progress)
//    }
//    .frame(width: 140, height: 150)
  }
}


struct WidgetDailyCalorie: Widget {
  let kind: String = "WidgetDailyCalorie"
  
  var body: some WidgetConfiguration {
    IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
      WidgetDailyCalorieEntryView(entry: entry)
//        .background(Color.gray)
    }
    .configurationDisplayName("Daily Calorie")
    .description("Daily calorie value")
  }
}

struct WidgetDailyCalorie_Previews: PreviewProvider {
  static var previews: some View {
    let valuesData:ReactValue=ReactValue(dailyPro: 216, dailyCarb: 187, DailyFat: 191, dailyCalorie: 2560, pro: 95, carbo: 160, fat: 120, calorie: 1897,dailyCaloriePercent: 0.6,dailyWater: 8,drinkedWater: 5,dailyPedometer: 5000,pedometer: 2450,dietProgress: 36,hasCredit: true)
    WidgetDailyCalorieEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), data: valuesData))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
  }
}
