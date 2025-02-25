import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "MyH2o"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    // Register for push notifications
    UNUserNotificationCenter.current().delegate = self
    
    // Request permission for push notifications
    UNUserNotificationCenter.current().requestAuthorization(
      options: [.alert, .sound, .badge],
      completionHandler: { (granted, error) in
        print("Permission granted: \(granted)")
        if granted {
          DispatchQueue.main.async {
            application.registerForRemoteNotifications()
          }
        }
        if let error = error {
          print("Request authorization failed: \(error)")
        }
      }
    )

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  // Handle notification when app is in foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .sound, .badge])
  }
  
  // Handle user interaction with the notification
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    completionHandler()
  }
  
  // Handle successful registration for remote notifications
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
  }
  
  // Handle failed registration for remote notifications
  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error)")
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
