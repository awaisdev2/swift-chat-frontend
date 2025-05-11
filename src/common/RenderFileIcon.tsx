const RenderFileIcon = ({
  fileType,
  className = "cursor-pointer",
  attachmentUrl,
}: {
  fileType: string | null;
  className?: string;
  attachmentUrl: string;
}) => {
  switch (fileType) {
    case "application/pdf":
      return <img className={className} src="/assets/pdf.svg" alt="PDF Icon" />;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return (
        <img className={className} src="/assets/xls.svg" alt="Excel Icon" />
      );
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return (
        <img className={className} src="/assets/doc.svg" alt="Docs Icon" />
      );
    case "image/jpeg":
    case "image/jpg":
    case "image/png":
      return (
        <img
          className={className}
          src={attachmentUrl || "/assets/jpg.svg"}
          alt="Img Icon"
        />
      );
    default:
      return (
        <img className={className} src="/assets/file.svg" alt="File Icon" />
      );
  }
};

export default RenderFileIcon;
