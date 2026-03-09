import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: ".",
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["./reporters/linear-reporter.ts"],
  ],
  projects: [
  {
    "name": "RAN-22",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-22",
        "beat": "beat-03b",
        "title": "Styleframe - Beat 3B: The Dive",
        "prompt": "Underwater shot at the bottom of a residential swimming pool. Two children's hands reaching downward toward a small toy robot sitting on the pale blue tiled pool floor. The hands are seen from slightly above and behind: we see arms extending into the frame from the top. The water is murky, with suspended particles catching diffused light from above. Caustic light patterns ripple across the pool tiles. The toy robot is in sharp focus at the centre of frame: a small, colourful Transformers-style action figure resting on the tile, incongruous and precious. The surrounding water has a green-blue haze, visibility falling off within a few metres. Small air bubbles trail from the reaching hands. The mood is reverent, archaeological: two children retrieving an artifact from the deep. Shot on 35mm film, heavy grain, muted teal-green colour palette. Shallow depth of field with robot sharp and everything else dissolving. Cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Scuba gear, goggles, ocean, coral reef, tropical fish, bright clear water, Olympic pool, adult hands, wide angle, playful, splashing.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 7 — Beat 3B: The Dive [Stress Test]"
    }
  },
  {
    "name": "RAN-21",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-21",
        "beat": "beat-08",
        "title": "Styleframe - Beat 8: Waterskiing Flashback",
        "prompt": "Slow-motion shot of a teenage boy rising out of the water on water skis, captured at the exact transition between submerged and upright. Water spray explodes outward from the skis in a dramatic fan. The tow rope is taut, pulling from the right of frame toward an unseen boat. The boy's body is half-crouched, arms extended, straining to hold on: the moment before standing fully upright. Backlit by harsh afternoon sun, the spray catches light and becomes a halo of white droplets. The water surface is dark and choppy. Background is blurred open harbour with distant shoreline. The mood is precarious, triumphant-about-to-be-stolen: the last frame before everything goes wrong. Shot on 35mm film, heavy grain, slightly warm palette with golden highlights in spray. Motion blur on water, sharp focus on hands gripping rope. Cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Professional waterskier, competition, wetsuit, calm water, lake, wide smile, celebratory, drone angle, overhead, tropical.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 6 — Beat 8: Waterskiing Flashback [Stress Test]"
    }
  },
  {
    "name": "RAN-20",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-20",
        "beat": "beat-05",
        "title": "Styleframe - Beat 5: On The Water",
        "prompt": "Aerial God's-eye shot looking straight down at a small motorboat cutting through open harbour water. Two figures visible in the boat, one wearing a red jacket and one wearing a blue jacket. The boat leaves a white wake trail that fans out behind it in a V shape. The water is deep blue-grey with scattered light reflections. The boat is small in frame, emphasising the vastness of open water around it. Bright midday light, no clouds. The mood is disorienting: you can see figures but not tell who is who or what they are doing. The water surface has a flat, almost abstract quality from this height. Shot on 16mm film, visible grain, slightly desaturated colour palette. The red and blue jackets are the only saturated colours in frame. Cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Sunset, golden hour, drone selfie, close-up of faces, calm lake, anchored boat, tropical, crystal clear water, low angle.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 5 — Beat 5: On The Water [Stress Test]"
    }
  },
  {
    "name": "RAN-19",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-19",
        "beat": "beat-02",
        "title": "Styleframe - Beat 2: Toys Falling",
        "prompt": "High-angle POV shot looking straight down from a window several storeys up. Multiple children's toys: action figures, a ball, a plastic car, building blocks, frozen mid-fall against a background of concrete or grass far below. The toys are scattered at different heights in the frame, suspended in air, caught in the moment before impact. Harsh daylight, strong shadows on the ground below. The window frame is just visible at the top edge of shot. The mood is clinical, observational, detached: a child conducting a physics experiment. Muted colour palette, warm beige and grey tones of a 1980s apartment exterior. Shot on 35mm film, slight grain, shallow depth of field with the toys sharp and the ground soft. Cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Cartoon, illustration, bright primary colours, playful, happy, playground, child visible, wide angle, eye-level.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 4 — Beat 2: Toys Falling [Stress Test]"
    }
  },
  {
    "name": "RAN-15",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-15",
        "beat": "beat-10",
        "title": "Styleframe - Beat 10: Monsoonal Rain",
        "prompt": "A small child standing alone on green astroturf beside a residential swimming pool in pouring rain. Monsoonal downpour with heavy, vertical sheets of water. The child is seen from behind at slight distance, standing upright and still, holding a small wristwatch in one hand. Tropical urban setting with the corner of a mid-rise apartment building in the background and warm interior lights glowing from windows. Night or deep dusk. Rain is the dominant visual element, saturating frame and catching light as a curtain of texture. The child's posture is steady, not sheltering. Dark, saturated colour palette: deep greens, warm amber building lights, silver-grey rain. High contrast with rich shadow detail. Shot on 35mm film, fine grain, cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Umbrella, raincoat, bright daylight, sunny, puddle splashing, playful, joyful, wide smile, running, tropical beach, palm trees.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 3 — Beat 10: Monsoonal Rain [ACT 3 Reference]"
    }
  },
  {
    "name": "RAN-14",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-14",
        "beat": "beat-06",
        "title": "Styleframe - Beat 6: The Call",
        "prompt": "Overexposed, bleached cinematography. A lone figure standing at the end of a weathered wooden pier, arms raised, waving frantically at a distant boat on open harbour water. Harsh midday sun, blown-out highlights on the water surface, high contrast shadows. The figure is small in frame, dwarfed by glare. The mood is desperate, isolated, unheard. The light has a washed-out, almost solarised quality with whites bleeding into the sky and water as a blinding silver-white plane. Heat haze distortion. Shot on 16mm film, overexposed by two stops, heavy grain, desaturated colour palette leaning pale blue and bone white. Cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Sunset, golden hour, warm tones, romantic, tropical beach, calm, serene, low contrast, soft lighting.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 2 — Beat 6: The Call / Static [ACT 2 Reference]"
    }
  },
  {
    "name": "RAN-13",
    "testMatch": [
      "tests/styleframes.spec.ts"
    ],
    "use": {
      "styleframe": {
        "issueId": "RAN-13",
        "beat": "beat-01",
        "title": "Styleframe - Beat 1: Underwater Open",
        "prompt": "Close-up, underwater shot inside a residential swimming pool. A child's eyes opening slowly, seen from directly in front of their face. The water is warm chlorine-green with soft caustic light patterns rippling across the child's skin. Shallow depth of field: the face is in focus, everything behind dissolves into blue-green blur. Small air bubbles drift upward. No goggles. The light source is above the surface, diffused and golden. The mood is calm, suspended, dreamlike. Shot on 35mm film, slight grain, muted colour palette leaning teal and aquamarine. Cinematic aspect ratio 2.39:1.",
        "negativePrompt": "Goggles, snorkel, scuba, tropical, ocean, coral, bright saturated colours, stock photography, overhead angle.",
        "aspectRatio": "16:9"
      },
      "expectToFail": true
    },
    "metadata": {
      "linearStateName": "Backlog",
      "linearStateType": "backlog",
      "linearTitle": "Styleframe 1 — Beat 1: Underwater Open [ACT 1 Reference]"
    }
  }
],
} as any);
