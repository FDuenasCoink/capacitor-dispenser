import Foundation

@objc public class Dispenser: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
