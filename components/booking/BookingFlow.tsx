import { useState } from "react";
import { RoomSelection } from "./RoomSelection";
import { ServiceSelection } from "./ServiceSelection";
import { CustomerDetails } from "./CustomerDetails";
import { BillingSummary } from "./BillingSummary";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Room, Customer, Booking } from "../../types";

export function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // If going back from step 4, clear the "confirmed" state to allow editing
      if (step === 4) {
        // Don't clear customerDetails, just allow re-editing
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedRoom && checkInDate && checkOutDate;
      case 2:
        return true; // Services are optional
      case 3:
        return customerDetails !== null;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: "Select Room" },
              { num: 2, title: "Add Services" },
              { num: 3, title: "Customer Details" },
              { num: 4, title: "Review & Pay" },
            ].map((item, index) => (
              <div key={item.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                      step >= item.num
                        ? "bg-amber-900 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {item.num}
                  </div>
                  <span className="mt-3 text-base font-medium">{item.title}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 flex-1 ${
                      step > item.num ? "bg-amber-900" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-10 mb-8">
          {step === 1 && (
            <RoomSelection
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              numberOfGuests={numberOfGuests}
              setNumberOfGuests={setNumberOfGuests}
            />
          )}

          {step === 2 && (
            <ServiceSelection
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          )}

          {step === 3 && (
            <CustomerDetails
              customerDetails={customerDetails}
              setCustomerDetails={setCustomerDetails}
            />
          )}

          {step === 4 && selectedRoom && customerDetails && (
            <BillingSummary
              selectedRoom={selectedRoom}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              numberOfGuests={numberOfGuests}
              selectedServices={selectedServices}
              customerDetails={customerDetails}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-5 text-base"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-amber-900 hover:bg-amber-800 px-6 py-5 text-base"
            >
              Next
              <ArrowRight size={20} className="ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}