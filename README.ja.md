# vr-paprika

パプリカのキャラクターの3Dアセットコレクションと、three.jsで構築されたシンプルなWebXR（VR/AR）ビューアのサンプルです。

[ライブデモ](https://code4fukui.github.io/vr-paprika/)

![アニメーションするパプリカキャラクターの3DモデルとUSDZへのQRコードリンクを示すデモのスクリーンショット。](https://code4fukui.github.io/vr-paprika/paprika.jpg)

## デモ

ブラウザや没入型VR/AR環境で3Dモデルを表示するための、Webベースのデモがいくつか含まれています。対応デバイスで `START VR` または `START AR` ボタンを使用すると、没入型セッションを開始できます。

-   **[アニメーションデモ](https://code4fukui.github.io/vr-paprika/anim.html)**: プロシージャルアニメーションで動くパプリカキャラクターのフルスクリーンビュー。
-   **[GLBモデルビューア](https://code4fukui.github.io/vr-paprika/glb.html)**: 結合済みの `paprika.glb` モデルを表示するシンプルなビューア。
-   **[ボックステスト](https://code4fukui.github.io/vr-paprika/box.html)**: 回転するキューブを配置した基本的なWebXRテストシーン。

## 3Dアセット

パプリカのキャラクターモデルは、以下の形式で利用できます：

-   **Blender:** `paprika.blend` - 編集用のオリジナルソースファイル。
-   **USDZ:** `paprika.usdz` - AppleデバイスのAR Quick Look用。
-   **glTF:**
    -   `paprika.glb`: 1つのモデルにまとまった完全なキャラクター。
    -   `paprika-body.glb`: キャラクターの体のみ。
    -   `paprika-hand-left.glb`: キャラクターの左手。
    -   `paprika-hand-right.glb`: キャラクターの右手。

## 使用例

同梱されている `egthree.js` モジュールを使用すると、`three.js` でのWebXRシーンを簡単にセットアップできます。`anim.html` のデモのように、キャラクターのパーツを読み込んで組み立てることができます。

```javascript
import { createScene, loadGLB, setAnimationLoop } from "./egthree.js";

// シーンとWebXRボタンの初期化
const scene = createScene(document.body);

// モデルパーツのロード
const body = await loadGLB("./paprika-body.glb");
const meshr = await loadGLB("./paprika-hand-right.glb");
const meshl = await loadGLB("./paprika-hand-left.glb");

// キャラクターの組み立て
scene.add(body);
body.add(meshr);
body.add(meshl);

// パーツの配置
meshr.position.set(-.045, .15, 0.03);
meshl.position.set(.05, .16, 0.03);
body.position.set(0, -0.1, -0.28);

// モデルのプロシージャルアニメーション
setAnimationLoop(() => {
  const t = performance.now();
  body.rotation.y += 0.005;
  meshr.rotation.x = Math.cos(t * 0.001) * Math.PI / 2;
  meshl.rotation.x = -Math.cos(t * 0.001) * Math.PI / 2;
});
```

## 依存関係

-   Webデモは [three.js](https://threejs.org/) を使用して構築されています。
