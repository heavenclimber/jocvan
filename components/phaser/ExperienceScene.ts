import * as Phaser from "phaser";

import { experience } from "@/data/experience";

export default class ExperienceScene extends Phaser.Scene {
  player!: Phaser.GameObjects.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  speed: number = 300;
  nodes: { x: number, data: any }[] = [];
  bg!: Phaser.GameObjects.TileSprite;
  groundRect!: Phaser.GameObjects.Rectangle;
  nodeVisuals: { marker: Phaser.GameObjects.Image, textCompany: Phaser.GameObjects.Text, textDate: Phaser.GameObjects.Text }[] = [];
  
  // Custom event emitter to communicate with React
  reactEvents: Phaser.Events.EventEmitter;
  
  activeNodeId: string | null = null;
  totalWidth: number = 0;

  constructor() {
    super("ExperienceScene");
    this.reactEvents = new Phaser.Events.EventEmitter();
  }

  preload() {
    this.load.image("bg_night", "/images/background/bg_night.jpg");
    for (let i = 1; i <= 8; i++) {
      this.load.image(`office_${i}`, `/images/assets/offices/10x/Asset ${i}.png`);
    }
    // Load character spritesheet (new dimensions 355x331 approx 88x165 per frame, 4x2 grid)
    this.load.spritesheet("char_sprite", "/images/assets/char/sprite.png", {
      frameWidth: 88,
      frameHeight: 165,
    });
  }

  create() {
    // Reverse the experience array so oldest is first (left to right progression)
    const chronologicalExp = [...experience].reverse();

    // Map configuration
    const startX = 300;
    const distanceBetweenNodes = 800;
    const groundY = this.cameras.main.height - 100;

    // Draw sky/background
    this.cameras.main.setBackgroundColor("#000814");

    // Looping parallax background
    this.bg = this.add.tileSprite(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height,
      "bg_night"
    );
    this.bg.setOrigin(0, 0);
    this.bg.setScrollFactor(0); // Fix to camera

    // Scale the repeating texture to exactly fit the logical height (600)
    const texture = this.textures.get("bg_night").getSourceImage();
    if (texture) {
      const scaleY = this.cameras.main.height / (texture as any).height;
      this.bg.setTileScale(scaleY, scaleY);
    }

    // Create a long ground
    this.totalWidth = startX + chronologicalExp.length * distanceBetweenNodes + 400;
    this.groundRect = this.add.rectangle(this.totalWidth / 2, groundY + 50, this.totalWidth, 100, 0x1e293b);

    // Create nodes
    chronologicalExp.forEach((exp, index) => {
      const x = startX + index * distanceBetweenNodes;
      this.nodes.push({ x, data: exp });

      // Node marker (Company Building)
      const officeKey = `office_${(index % 8) + 1}`;
      const marker = this.add.image(x, groundY, officeKey).setOrigin(0.5, 1);
      
      // Scale building to a reasonable size (e.g. height 200)
      const targetHeight = 180;
      marker.setScale(targetHeight / marker.height);
      
      // Node text (placed above the building)
      const textCompany = this.add.text(x, groundY - 230, exp.company, {
        fontSize: "18px",
        color: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#00000088",
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5, 0.5);
      
      const textDate = this.add.text(x, groundY - 200, exp.startDate, {
        fontSize: "14px",
        color: "#94a3b8",
        backgroundColor: "#00000088",
        padding: { x: 6, y: 2 },
      }).setOrigin(0.5, 0.5);
      
      this.nodeVisuals.push({ marker, textCompany, textDate });
    });

    // Create animations (4 frames idle, 4 frames run)
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("char_sprite", { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("char_sprite", { start: 4, end: 7 }),
      frameRate: 12,
      repeat: -1,
    });

    // Create player sprite
    // Added +12 offset to Y to account for transparent space at the bottom of the sprite frames
    this.player = this.add.sprite(100, groundY + 12, "char_sprite").setOrigin(0.5, 1);
    this.player.setScale(0.7); // Scale down if needed
    this.player.play("idle");

    // Camera setup
    this.cameras.main.setBounds(0, 0, this.totalWidth, this.cameras.main.height);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    
    // Handle window resize dynamically
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      const newHeight = gameSize.height;
      const newGroundY = newHeight - 100;
      
      // Update camera bounds
      this.cameras.main.setBounds(0, 0, this.totalWidth, newHeight);

      // Update background size and scale
      this.bg.setSize(gameSize.width, newHeight);
      const tex = this.textures.get("bg_night").getSourceImage();
      if (tex) {
        const sY = newHeight / (tex as any).height;
        this.bg.setTileScale(sY, sY);
      }

      // Update ground Y
      this.groundRect.y = newGroundY + 50;

      // Update nodes Y
      this.nodeVisuals.forEach(nv => {
        nv.marker.y = newGroundY;
        nv.textCompany.y = newGroundY - 230;
        nv.textDate.y = newGroundY - 200;
      });
      
      // Update player Y (anchored to ground, with +12 offset)
      this.player.y = newGroundY + 12;
    });

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    // Add WASD as well
    if (this.input.keyboard) {
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  update(time: number, delta: number) {
    if (!this.cursors) return;
    
    const deltaSec = delta / 1000;
    
    // Movement
    let isMoving = false;
    
    // Check left
    const aKey = this.input.keyboard?.keys[Phaser.Input.Keyboard.KeyCodes.A] as Phaser.Input.Keyboard.Key;
    if (this.cursors.left.isDown || (aKey && aKey.isDown)) {
      this.player.x -= this.speed * deltaSec;
      this.player.flipX = true;
      isMoving = true;
    } 
    // Check right
    else if (this.cursors.right.isDown || (aKey && (this.input.keyboard?.keys[Phaser.Input.Keyboard.KeyCodes.D] as Phaser.Input.Keyboard.Key).isDown)) {
      this.player.x += this.speed * deltaSec;
      this.player.flipX = false;
      isMoving = true;
    }

    // Animation state
    if (isMoving) {
      if (this.player.anims.currentAnim?.key !== "run") {
        this.player.play("run");
      }
    } else {
      if (this.player.anims.currentAnim?.key !== "idle") {
        this.player.play("idle");
      }
    }

    // Boundaries
    if (this.player.x < 20) this.player.x = 20;
    if (this.player.x > this.totalWidth - 20) this.player.x = this.totalWidth - 20;

    // Proximity check
    let nearestNode = null;
    let minDistance = 150; // Trigger radius

    for (const node of this.nodes) {
      const dist = Math.abs(this.player.x - node.x);
      if (dist < minDistance) {
        nearestNode = node;
        break;
      }
    }

    if (nearestNode) {
      if (this.activeNodeId !== nearestNode.data.id) {
        this.activeNodeId = nearestNode.data.id;
        this.reactEvents.emit("nodeReached", nearestNode.data);
      }
    } else {
      if (this.activeNodeId !== null) {
        this.activeNodeId = null;
        this.reactEvents.emit("nodeLeft");
      }
    }
    
    // Parallax background
    if (this.bg) {
      this.bg.tilePositionX = this.cameras.main.scrollX * 0.3;
    }
  }
}
