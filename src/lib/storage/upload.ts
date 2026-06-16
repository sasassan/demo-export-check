export async function uploadImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("画像の読み込みに失敗しました。"));
    };

    reader.onerror = () => {
      reject(new Error("画像の読み込みに失敗しました。"));
    };

    reader.readAsDataURL(file);
  });
}