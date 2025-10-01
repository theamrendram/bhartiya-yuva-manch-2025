import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Ban } from "lucide-react";

const RegistrationsClosed: React.FC = () => (
  <Alert variant="destructive" className="my-6">
    <Ban className="h-5 w-5" />
    <div>
      <AlertTitle>Registrations are closed</AlertTitle>
      <AlertDescription>
        We are no longer accepting new registrations for this event.
      </AlertDescription>
    </div>
  </Alert>
);

export default RegistrationsClosed; 