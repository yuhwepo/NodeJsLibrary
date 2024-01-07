import { StudentManager } from "./StudentManager";

(async () => {
  const manager = new StudentManager();
  await manager.run();
})();
