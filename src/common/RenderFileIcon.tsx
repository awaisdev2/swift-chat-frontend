/* eslint-disable @typescript-eslint/no-explicit-any */
const RenderFileIcon = ({
  fileType,
  className = "cursor-pointer rounded-lg",
  attachmentUrl,
  messagesAttachment = false,
}: {
  fileType: any;
  className?: string;
  attachmentUrl: any;
  messagesAttachment?: boolean;
}) => {
  switch (fileType) {
    case "application/pdf":
      return (
        <img
          className={className}
          onClick={() => messagesAttachment && window.open(attachmentUrl, "_blank")}
          src="/assets/pdf.svg"
          alt="PDF Icon"
        />
      );
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return (
        <img
          className={className}
          onClick={() => messagesAttachment && window.open(attachmentUrl, "_blank")}
          src="/assets/xls.svg"
          alt="Excel Icon"
        />
      );
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return (
        <img
          className={className}
          onClick={() => messagesAttachment && window.open(attachmentUrl, "_blank")}
          src="/assets/doc.svg"
          alt="Docs Icon"
        />
      );
    case "image/jpeg":
    case "image/jpg":
    case "image/png":
      return (
        <img
          className={className}
          onClick={() => window.open(attachmentUrl, "_blank")}
          src={attachmentUrl || "/assets/jpg.svg"}
          alt="Img Icon"
        />
      );
    default:
      return messagesAttachment ? (
        <img className={className} src="/assets/file.svg" alt="File Icon" />
      ) : (
        <img
          className={className}
          onClick={() => messagesAttachment && window.open(attachmentUrl, "_blank")}
          src="/assets/file.svg"
          alt="File Icon"
        />
      );
  }
};

export default RenderFileIcon;
