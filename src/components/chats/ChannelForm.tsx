import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useCreateChannel, useUpdateChannel } from "@/queries/channels";

interface ChannelFormProps {
  channelToEdit?: { id: string; name: string } | null;
  onClose: () => void;
}

const ChannelForm: React.FC<ChannelFormProps> = ({
  channelToEdit,
  onClose,
}) => {
  const { mutateAsync: createChannel, isPending: isCreating } =
    useCreateChannel();
  const { mutateAsync: updateChannel, isPending: isUpdating } =
    useUpdateChannel();

  const initialValues = {
    name: channelToEdit?.name || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(5)
      .max(30)
      .required("Channel name is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (channelToEdit) {
      await updateChannel({ channelId: channelToEdit.id, name: values.name });
    } else {
      await createChannel({ name: values.name });
    }
    onClose();
  };

  return (
    <div className="py-3">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Channel Name
            </label>
            <Field
              name="name"
              type="text"
              className="bg-gray-50 border w-full px-3 py-2 border-gray-300 text-gray-900 text-sm rounded-lg"
              placeholder="Enter channel name here"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              className='bg-gray-400 hover:bg-gray-300 transition-all hover:text-black text-white'
              onClick={onClose}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 transition-all text-white"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ChannelForm;
