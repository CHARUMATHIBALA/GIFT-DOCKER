import { useNavigate, useLocation } from "react-router-dom"
import QRPayment from "../components/QRPayment"

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const amount = location.state?.amount || 2499 // Default fallback amount

  return (
    <QRPayment
      amount={amount}
      onSuccess={() => navigate("/orders")}
      onCancel={() => navigate("/cart")}
    />
  )
}
