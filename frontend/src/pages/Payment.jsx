import { useNavigate } from "react-router-dom"
import QRPayment from "../components/QRPayment"

export default function Payment() {
  const navigate = useNavigate()

  return (
    <QRPayment
      amount={2499}
      onSuccess={() => navigate("/products")}
      onCancel={() => navigate(-1)}
    />
  )
}
