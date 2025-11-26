import { useState } from "react";
import { Customer } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface CustomerDetailsProps {
  customerDetails: Customer | null;
  setCustomerDetails: (details: Customer) => void;
}

export function CustomerDetails({
  customerDetails,
  setCustomerDetails,
}: CustomerDetailsProps) {
  const [formData, setFormData] = useState<Customer>(
    customerDetails || {
      name: "",
      age: 18,
      gender: "",
      contactNo: "",
      validId: "",
      email: "",
    }
  );

  const handleChange = (field: keyof Customer, value: string | number) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  const handleSubmit = () => {
    setCustomerDetails(formData);
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.age > 0 &&
      formData.gender &&
      formData.contactNo &&
      formData.validId &&
      formData.email
    );
  };

  return (
    <div>
      <h2 className="text-3xl mb-2">Customer Details</h2>
      <p className="text-gray-600 mb-6">Please provide your information for the booking</p>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <Label>Age *</Label>
              <Input
                type="number"
                placeholder="Enter your age"
                value={formData.age || ""}
                onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
                min="18"
              />
            </div>

            <div>
              <Label>Gender *</Label>
              <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Contact Number *</Label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.contactNo}
                onChange={(e) => handleChange("contactNo", e.target.value)}
              />
            </div>

            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Valid ID (PAN/Aadhar/Passport) *</Label>
              <Input
                placeholder="Enter ID number"
                value={formData.validId}
                onChange={(e) => handleChange("validId", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="bg-amber-900 hover:bg-amber-800"
            >
              Save & Continue
            </Button>
          </div>
        </CardContent>
      </Card>

      {customerDetails && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <p className="text-green-800">✓ Customer details saved successfully</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}