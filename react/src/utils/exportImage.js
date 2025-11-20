export const exportStageAsImage = (stageRef, type = "png") => {
  const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = `collage.${type}`;
  link.href = uri;
  link.click();
};
