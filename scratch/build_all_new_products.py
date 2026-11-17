import os
import json

base_public = os.path.abspath('public')

def get_rel_images(folder_rel):
    folder_abs = os.path.join(base_public, folder_rel.replace('/', os.sep))
    if not os.path.exists(folder_abs):
        raise FileNotFoundError(f"Missing: {folder_abs}")
    files = [f for f in sorted(os.listdir(folder_abs)) if os.path.isfile(os.path.join(folder_abs, f)) and not f.startswith('.')]
    return [f"/{folder_rel.replace(os.sep, '/')}/{f}" for f in files]

guides = [
    "/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg"
]

# Accessories
accessories = [
    {
        "id": "ac-pnt-p2",
        "name": "Penta Plex P2 Multi-Action Disinfectant Solution",
        "sku": "AC-PNT-P2",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Penta Plex",
        "price": 1100,
        "originalPrice": 1400,
        "packOptions": [
            {"id": "120ml", "name": "120ml Everyday Bottle", "price": 1100},
            {"id": "350ml", "name": "350ml Economy Value Pack", "price": 2250, "savingsBadge": "Best Value"}
        ],
        "rating": 5.0,
        "reviewCount": 36,
        "images": [
            "/eyeglassimages/Asscesoories/lens accsessores/PENTA PLEX P2 120ml rs 1100.jpeg",
            "/eyeglassimages/Asscesoories/lens accsessores/PENTA PLEX P2 350ml rs 2250 .jpeg"
        ],
        "description": "Penta Plex P2 is a premium multi-purpose disinfectant and conditioning solution formulated for soft contact lenses. Eliminates 99.9% of bacteria, dissolves stubborn protein deposits, and maintains moist comfort for up to 16 hours.",
        "features": [
            "Cleans, rinses, disinfects, and dissolves surface protein deposits",
            "Available in 120ml compact size and 350ml economy value pack",
            "Ophthalmic balanced pH buffers guard against eye redness",
            "Suitable for all daily, monthly, and quarterly soft contact lenses"
        ],
        "inStock": True,
        "isBestSeller": True,
        "availableColors": [{"name": "Sterile Optical Solution", "hex": "#0284c7"}],
        "reviews": []
    },
    {
        "id": "ac-cry-150",
        "name": "Crysta 150ml Multi-Purpose Disinfectant Lens Solution",
        "sku": "AC-CRY-150",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Crysta",
        "price": 500,
        "originalPrice": 650,
        "rating": 4.8,
        "reviewCount": 24,
        "images": ["/eyeglassimages/Asscesoories/lens accsessores/Crysta 150ml. Multi-purpose Disinfectant Solution For Soft Contact Lenses RS 500.jpeg"],
        "description": "Crysta 150ml multi-purpose disinfectant solution formulated for soft contact lenses. Effectively clears lipid film and hydrates lenses for smooth daily insertion.",
        "features": [
            "Complete 4-in-1 action: Cleans, rinses, stores, and disinfects",
            "Hydrating comfort cushion reduces lens friction",
            "150ml bottle with precision dropper nozzle",
            "Formulated for soft hydrophilic contact lenses"
        ],
        "inStock": True,
        "availableColors": [{"name": "Clear Solution", "hex": "#38bdf8"}],
        "reviews": []
    },
    {
        "id": "ac-cry-gp",
        "name": "Crysta Crys GP 120ml RGP Hard Contact Lens Solution",
        "sku": "AC-CRY-GP",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Crysta",
        "price": 1850,
        "originalPrice": 2200,
        "rating": 4.9,
        "reviewCount": 18,
        "images": ["/eyeglassimages/Asscesoories/lens accsessores/Crysta Crys GP 120ml.RGP Solution for Hard Contact Lenses rs 1850.jpeg"],
        "description": "Crysta Crys GP 120ml specialized conditioning and cleaning solution specifically designed for Rigid Gas Permeable (RGP) and hard contact lenses.",
        "features": [
            "Specialized for Rigid Gas Permeable (RGP) and hard contact lenses",
            "Powerful lipid and protein removal without surface scratching",
            "Enhances surface wettability for seamless blinking",
            "Doctor recommended for keratoconus and specialized RGP wearers"
        ],
        "inStock": True,
        "availableColors": [{"name": "RGP Formula", "hex": "#0ea5e9"}],
        "reviews": []
    },
    {
        "id": "ac-cry-kit",
        "name": "Crysta Contact Lens Travel Kit (75ml Solution + Case + Pouch)",
        "sku": "AC-CRY-KIT",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Crysta",
        "price": 350,
        "originalPrice": 500,
        "rating": 4.9,
        "reviewCount": 45,
        "images": ["/eyeglassimages/Asscesoories/lens accsessores/Crysta lens kit 75ml. Solution, lens case and poch rs 350.jpeg"],
        "description": "Complete portable contact lens travel kit including 75ml sterile disinfectant solution, dual leak-proof lens case, and protective travel pouch. Flight and handbag approved.",
        "features": [
            "Includes 75ml solution bottle, dual lens case, and zip travel pouch",
            "TSA / cabin luggage friendly size",
            "Leak-proof cap design prevents handbag spills",
            "Essential for office, vacations, and gym bags"
        ],
        "inStock": True,
        "isBestSeller": True,
        "availableColors": [{"name": "Complete Travel Kit", "hex": "#6366f1"}],
        "reviews": []
    },
    {
        "id": "ac-imp-120",
        "name": "Impact Excel 120ml Multi-Purpose Contact Lens Solution",
        "sku": "AC-IMP-120",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Impact Excel",
        "price": 160,
        "originalPrice": 220,
        "rating": 4.7,
        "reviewCount": 19,
        "images": ["/eyeglassimages/Asscesoories/lens accsessores/Impact excel 120ml. rs 160.jpeg"],
        "description": "Impact Excel 120ml reliable daily contact lens solution. High-value everyday cleaning, rinsing, and storage solution for students and daily wearers.",
        "features": [
            "Affordable daily maintenance solution",
            "120ml bottle with safety seal",
            "Mild disinfectant action for sensitive eyes"
        ],
        "inStock": True,
        "availableColors": [{"name": "Sterile Solution", "hex": "#38bdf8"}],
        "reviews": []
    },
    {
        "id": "ac-slt-120",
        "name": "Solite 120ml Soothing Contact Lens Solution",
        "sku": "AC-SLT-120",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Solite",
        "price": 360,
        "originalPrice": 450,
        "rating": 4.8,
        "reviewCount": 14,
        "images": ["/eyeglassimages/Asscesoories/lens accsessores/Solite 120 ml 360.jpeg"],
        "description": "Solite 120ml gentle contact lens disinfectant solution. Moisture-enhancing formulation for sensitive cornea profiles and dry AC environments.",
        "features": [
            "Comfort-enhanced formula reduces dry eye sensation",
            "Safe for daily cleaning and overnight storage",
            "Made with isotonic buffering agents"
        ],
        "inStock": True,
        "availableColors": [{"name": "Soothing Solution", "hex": "#0284c7"}],
        "reviews": []
    },
    {
        "id": "ac-ult-120",
        "name": "Ultimate Plus 120ml Advanced Contact Lens Solution",
        "sku": "AC-ULT-120",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Ultimate Plus",
        "price": 560,
        "originalPrice": 700,
        "rating": 4.8,
        "reviewCount": 17,
        "images": ["/eyeglassimages/Asscesoories/lens accsessores/Ultimate Plus 120ml.rs560.jpeg"],
        "description": "Ultimate Plus 120ml high-efficiency contact lens disinfectant solution. Rapid protein breakdown and surface lubricity for long-wearing soft contact lenses.",
        "features": [
            "Advanced antimicrobial efficacy",
            "Lubricating surface barrier lasts throughout the day",
            "Ideal for colored and transparent contact lenses"
        ],
        "inStock": True,
        "availableColors": [{"name": "Advanced Formula", "hex": "#2563eb"}],
        "reviews": []
    },
    {
        "id": "ac-gl-hook",
        "name": "Glasses Anti-Slip Silicone Ear Hooks (Comfort Grips)",
        "sku": "AC-GL-HOOK",
        "category": "accessories",
        "subCategory": "Eyewear Accessories",
        "gender": "unisex",
        "brand": "Federal Care",
        "price": 250,
        "originalPrice": 400,
        "rating": 4.9,
        "reviewCount": 58,
        "images": get_rel_images('eyeglassimages/Asscesoories/glass accesssories/Glasses Anti Slip Silicone Ear Hooks rs 250'),
        "description": "Soft medical-grade silicone temple ear hooks. Secures eyewear firmly behind the ears, eliminating slipping during gym workouts, active work, driving, or heat.",
        "features": [
            "Prevents glasses from sliding down your nose bridge",
            "Skin-friendly flexible silicone (sweat-proof & washable)",
            "Fits nearly all thin and thick temple arms",
            "Discrete behind-the-ear profile"
        ],
        "inStock": True,
        "isBestSeller": True,
        "availableColors": [
            {"name": "Clear Transparent", "hex": "#f1f5f9"},
            {"name": "Stealth Black", "hex": "#18181b"}
        ],
        "reviews": []
    },
    {
        "id": "ac-gl-rope",
        "name": "Adjustable Eyewear Retainer Cord (Glasses Rope / Dori)",
        "sku": "AC-GL-ROPE",
        "category": "accessories",
        "subCategory": "Eyewear Accessories",
        "gender": "unisex",
        "brand": "Federal Care",
        "price": 150,
        "originalPrice": 250,
        "rating": 4.8,
        "reviewCount": 42,
        "images": get_rel_images('eyeglassimages/Asscesoories/glass accesssories/Glasses Rope ( Dori) rs 150'),
        "description": "Durable braided nylon eyeglasses retainer cord (dori) with rubber gripping loops. Hangs comfortably around the neck for easy on/off access during reading, work, and sports.",
        "features": [
            "Adjustable locking slider for custom tightness",
            "High-tensile woven cord resists fraying",
            "Universal rubber connector fits any frame temple",
            "Available in multiple colors"
        ],
        "inStock": True,
        "availableColors": [
            {"name": "Midnight Black", "hex": "#09090b"},
            {"name": "Navy Blue", "hex": "#1e3a8a"},
            {"name": "Ruby Red", "hex": "#991b1b"}
        ],
        "reviews": []
    },
    {
        "id": "ac-cln-120",
        "name": "Federal Optical Lens & Glass Cleaner Spray (Anti-Smudge)",
        "sku": "AC-CLN-120",
        "category": "accessories",
        "subCategory": "Lens Solutions & Care",
        "gender": "unisex",
        "brand": "Federal Care",
        "price": 120,
        "originalPrice": 200,
        "rating": 4.9,
        "reviewCount": 65,
        "images": ["/eyeglassimages/Asscesoories/Glass cleaner RS 120/WhatsApp Image 2026-10-20 at 6.59.48 PM.jpeg"],
        "description": "Professional anti-static and anti-fog lens cleaner spray. Safe for all multi-coated, anti-reflective, and photochromic optical lenses. Dissolves oils and finger smudges instantly.",
        "features": [
            "Streak-free crystal clarity with one spritz",
            "Safe for high-index, anti-glare, and blue-cut optical coatings",
            "Anti-static dust-repellent barrier",
            "Compact spray bottle fits in pocket or desk drawer"
        ],
        "inStock": True,
        "isBestSeller": True,
        "availableColors": [{"name": "Optical Cleaner", "hex": "#06b6d4"}],
        "reviews": []
    },
    {
        "id": "ac-sg-box",
        "name": "Luxury Designer Sunglass Protective Hard Box Case",
        "sku": "AC-SG-BOX",
        "category": "accessories",
        "subCategory": "Eyewear Accessories",
        "gender": "unisex",
        "brand": "Federal Atelier",
        "price": 2000,
        "originalPrice": 2800,
        "rating": 5.0,
        "reviewCount": 29,
        "images": get_rel_images('eyeglassimages/Asscesoories/Sunglass Boxes RS 2000 each'),
        "description": "Premium crush-proof protective sunglasses presentation box with magnetic latch, plush interior lining, and luxury texture finish. Designed to house oversized and designer sunglasses.",
        "features": [
            "Rigid crush-proof chassis shields expensive lenses",
            "Magnetic flip closure with gold-stamped detailing",
            "Velveteen interior prevents lens abrasions",
            "Fits oversized sunglasses, aviators, and sports shields"
        ],
        "inStock": True,
        "isBestSeller": True,
        "availableColors": [
            {"name": "Luxury Matte Black", "hex": "#18181b"},
            {"name": "Classic Tan Brown", "hex": "#92400e"}
        ],
        "reviews": []
    }
]

# Sunglasses
sunglasses = [
    {
        "id": "sg-crt-01",
        "name": "Cartier Signature Luxury Sunglasses (4 Colors)",
        "sku": "SG-CRT-01",
        "category": "sunglasses",
        "subCategory": "Men's Sunglasses",
        "gender": "unisex",
        "brand": "Cartier",
        "price": 5800,
        "originalPrice": 7500,
        "rating": 5.0,
        "reviewCount": 33,
        "images": get_rel_images('eyeglassimages/sunglasses/CARTIER 4 Colors RS 5800'),
        "description": "Cartier signature luxury sunglasses featuring an opulent metallic rectangular silhouette, intricate temple hinge motifs, and premium UV400 sun protection. Available in 4 stunning color variants.",
        "features": [
            "UV400 Category 3 polarized sun lenses",
            "Intricately sculpted Cartier-inspired luxury temples",
            "Spring-loaded flex hinges for a contouring fit",
            "Available in Gold/Black, Silver/Black, Demi Tortoise, and Champagne",
            "Supplied with protective case and optical cloth"
        ],
        "inStock": True,
        "isBestSeller": True,
        "frameShape": "rectangular",
        "frameMaterial": "Gold-Plated Titanium Alloy Blend",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Gold Frame & Dark Tint", "hex": "#d4af37"},
            {"name": "Silver Frame & Grey Gradient", "hex": "#94a3b8"},
            {"name": "Demi Amber Tortoise", "hex": "#78350f"},
            {"name": "Onyx Black & Gold", "hex": "#111111"}
        ],
        "reviews": []
    },
    {
        "id": "sg-cln-01",
        "name": "Celine Bold Statement Couture Sunglasses (5 Colors)",
        "sku": "SG-CLN-01",
        "category": "sunglasses",
        "subCategory": "Women's Sunglasses",
        "gender": "women",
        "brand": "Celine",
        "price": 5800,
        "originalPrice": 7500,
        "rating": 5.0,
        "reviewCount": 39,
        "images": get_rel_images('eyeglassimages/sunglasses/CELINE 5 COLORS RS 5800'),
        "description": "Celine Paris couture oversized sunglasses with bold sculptural bevels and signature triple dot temple pins. Hand-polished Italian acetate feel with full UV400 sun protection in 5 distinct colorways.",
        "features": [
            "Thick sculptural Italian-style acetate profile",
            "100% UV400 protective dark tint sun lenses",
            "Subtle lifted cat-eye contours flattering all face structures",
            "Available in Gloss Black, Havana Tortoise, Honey Amber, Olive, and Cream",
            "Supplied with Federal Optical luxury case"
        ],
        "inStock": True,
        "isBestSeller": True,
        "frameShape": "cat-eye",
        "frameMaterial": "Hand-Polished High-Density Acetate",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Glossy Jet Black", "hex": "#111111"},
            {"name": "Rich Havana Tortoise", "hex": "#5b2909"},
            {"name": "Honey Amber", "hex": "#d97706"},
            {"name": "Olive Earth Gradient", "hex": "#4d5b44"},
            {"name": "Ivory Cream", "hex": "#fef3c7"}
        ],
        "reviews": []
    },
    {
        "id": "sg-lv-01",
        "name": "Louis Vuitton Haute Designer Sunglasses (5 Colors)",
        "sku": "SG-LV-01",
        "category": "sunglasses",
        "subCategory": "Men's Sunglasses",
        "gender": "unisex",
        "brand": "Louis Vuitton",
        "price": 5800,
        "originalPrice": 7500,
        "rating": 5.0,
        "reviewCount": 41,
        "images": get_rel_images('eyeglassimages/sunglasses/LOUIS VUITTON 5 Colors RS 5800'),
        "description": "Louis Vuitton haute designer sunglasses with structured square navigator geometry, engraved metallic accents, and high-contrast polarized sun lenses. Crafted in 5 commanding colorways.",
        "features": [
            "High-contrast polarized Category 3 lenses for glare reduction",
            "Laser-engraved metallic temple insignia",
            "Reinforced 5-barrel hinges for exceptional durability",
            "Available in Black/Gold, Demi Tortoise, Crystal Smoke, Caramel, and Slate Navy"
        ],
        "inStock": True,
        "isBestSeller": True,
        "frameShape": "square",
        "frameMaterial": "Cellulose Acetate & Metal Core",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Black & Gold Accent", "hex": "#18181b"},
            {"name": "Dark Demi Tortoise", "hex": "#713f12"},
            {"name": "Crystal Smoke Grey", "hex": "#475569"},
            {"name": "Warm Amber Caramel", "hex": "#b45309"},
            {"name": "Matte Slate Navy", "hex": "#1e293b"}
        ],
        "reviews": []
    },
    {
        "id": "sg-mj-01",
        "name": "Marc Jacobs Contemporary Sunglasses (3 Colors)",
        "sku": "SG-MJ-01",
        "category": "sunglasses",
        "subCategory": "Women's Sunglasses",
        "gender": "women",
        "brand": "Marc Jacobs",
        "price": 5800,
        "originalPrice": 7500,
        "rating": 4.9,
        "reviewCount": 27,
        "images": get_rel_images('eyeglassimages/sunglasses/MARK JACOBS 3 COLORS RS 5800'),
        "description": "Marc Jacobs designer sunglasses combining a soft geometric butterfly shape with graceful temple lines. Ultra-chic styling with 100% UV400 sun blocking lenses in 3 fashion-forward colors.",
        "features": [
            "Flattering oversized rounded-geometric silhouette",
            "UV400 sun-guard lenses protect against cataracts and eye strain",
            "Comfort bridge designed for long wear without slipping",
            "Available in Classic Noir, Tortoise Amber, and Soft Blush Mauve"
        ],
        "inStock": True,
        "frameShape": "geometric",
        "frameMaterial": "Lightweight Acetate & Stainless Steel",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Classic Noir Black", "hex": "#09090b"},
            {"name": "Tortoise Amber", "hex": "#92400e"},
            {"name": "Soft Blush Mauve", "hex": "#f43f5e"}
        ],
        "reviews": []
    },
    {
        "id": "sg-prd-01",
        "name": "Prada Milano Faceted Temple Sunglasses (4 Colors)",
        "sku": "SG-PRD-01",
        "category": "sunglasses",
        "subCategory": "Men's Sunglasses",
        "gender": "unisex",
        "brand": "Prada",
        "price": 5800,
        "originalPrice": 7500,
        "rating": 5.0,
        "reviewCount": 48,
        "images": get_rel_images('eyeglassimages/sunglasses/PRADA 4 COLORS RS 5800'),
        "description": "Prada Milano signature sunglasses with architectural faceted temple arms and the distinctive triangular motif. Precision polarized UV400 sun protection in 4 contemporary color editions.",
        "features": [
            "Iconic faceted geometric temple arms with Prada Milano lettering",
            "Polarized glare-free optical lenses",
            "Ergonomic weight distribution for all-day comfort",
            "Available in Onyx Black, Deep Tortoise, Translucent Slate, and Olive Tone"
        ],
        "inStock": True,
        "isBestSeller": True,
        "frameShape": "square",
        "frameMaterial": "Sculpted Italian Acetate",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Onyx Black & Grey Tint", "hex": "#0f172a"},
            {"name": "Deep Tortoise Brown", "hex": "#451a03"},
            {"name": "Translucent Slate", "hex": "#64748b"},
            {"name": "Olive Green Tone", "hex": "#365314"}
        ],
        "reviews": []
    }
]

# Eyeglasses
eyeglasses = [
    {
        "id": "fo-lew-01",
        "name": "Federal Atelier Sculpted Ladies Eyewear Collection",
        "sku": "FO-LEW-01",
        "category": "eyeglasses",
        "subCategory": "Women's Eyeglasses",
        "gender": "women",
        "brand": "Federal Atelier",
        "price": 1999,
        "originalPrice": 2800,
        "rating": 4.9,
        "reviewCount": 35,
        "images": get_rel_images('eyeglassimages/LADIES EYEWARE Colors Purple, Pink, Maroon Golden , rs 19990'),
        "description": "Sculpted lightweight ladies optical frame featuring a gracefully uplifted butterfly cat-eye silhouette. Finished in four rich metallic and jewel-tone shades for work, occasions, and daily elegance.",
        "features": [
            "Gracefully uplifted butterfly cat-eye styling",
            "Available in Royal Purple, Rose Pink, Deep Velvet Maroon, and Warm Golden",
            "Reinforced lightweight metallic bridge with soft silicone pads",
            "Compatible with all Federal digital single vision, blue-cut, and bifocal lenses"
        ],
        "inStock": True,
        "isNew": True,
        "isBestSeller": True,
        "frameShape": "cat-eye",
        "frameMaterial": "High-Grade Lightweight Metal & Acetate Tips",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Royal Purple", "hex": "#7e22ce"},
            {"name": "Pastel Rose Pink", "hex": "#f472b6"},
            {"name": "Deep Velvet Maroon", "hex": "#881337"},
            {"name": "Lustrous Warm Golden", "hex": "#eab308"}
        ],
        "reviews": []
    },
    {
        "id": "fo-por-01",
        "name": "Porsche Design Executive Dual-Tone Titanium Blend Frames",
        "sku": "FO-POR-01",
        "category": "eyeglasses",
        "subCategory": "Men's Eyeglasses",
        "gender": "men",
        "brand": "Porsche Design",
        "price": 3250,
        "originalPrice": 4500,
        "rating": 5.0,
        "reviewCount": 29,
        "images": get_rel_images('eyeglassimages/PORRSCEHE BLACK GOLDEN , COPPER M SILVER , GOLDEN , BLACK RS 3250'),
        "description": "High-performance men's executive frames inspired by Porsche automotive engineering. Dual-tone precision metal profile with flex hinges for tailored fit, commanding presence, and all-day comfort.",
        "features": [
            "Aerodynamic titanium-blend chassis engineered for zero fatigue",
            "Dual-tone luxury accents: Black/Gold, Copper/Silver, Golden, and Carbon Black",
            "Spring-loaded flex hinges prevent temple widening over years of wear",
            "Includes Federal Optical 1975 case and micro-fiber cloth"
        ],
        "inStock": True,
        "isNew": True,
        "isBestSeller": True,
        "frameShape": "rectangle",
        "frameMaterial": "Titanium-Blend Ultra-Light Metal",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Black & Golden", "hex": "#d4af37"},
            {"name": "Copper Metallic & Silver", "hex": "#b45309"},
            {"name": "Polished Golden", "hex": "#eab308"},
            {"name": "Sleek Carbon Black", "hex": "#18181b"}
        ],
        "reviews": []
    },
    {
        "id": "fo-yqk-01",
        "name": "YQKEAKOG Resilient Lightweight TR Eyeglasses",
        "sku": "FO-YQK-01",
        "category": "eyeglasses",
        "subCategory": "Men's Eyeglasses",
        "gender": "unisex",
        "brand": "Yqkeakog",
        "price": 2650,
        "originalPrice": 3500,
        "rating": 4.8,
        "reviewCount": 22,
        "images": get_rel_images('eyeglassimages/YQKEAKOG RS 2650'),
        "description": "Ultra-durable TR-90 lightweight polymer eyeglasses with memory flex temples. Designed for all-day comfort without nose pinching or ear fatigue across work, study, and daily activities.",
        "features": [
            "Memory-flex TR-90 polymer frame bends without snapping",
            "Super lightweight (under 18 grams) eliminates bridge marks",
            "Available in Gloss Black, Matte Black, Slate Grey, and Demi Brown",
            "Ideal for high-prescription lenses and blue-light screen glasses"
        ],
        "inStock": True,
        "isNew": True,
        "frameShape": "square",
        "frameMaterial": "TR-90 Memory Polymer",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Gloss Black", "hex": "#0a0a0a"},
            {"name": "Matte Charcoal Black", "hex": "#262626"},
            {"name": "Smoky Slate Grey", "hex": "#525252"},
            {"name": "Rich Demi Brown", "hex": "#78350f"}
        ],
        "reviews": []
    },
    {
        "id": "fo-yny-01",
        "name": "YunYi Flexible Featherlight Two-Tone Frames",
        "sku": "FO-YNY-01",
        "category": "eyeglasses",
        "subCategory": "Women's Eyeglasses",
        "gender": "unisex",
        "brand": "Yunyi",
        "price": 1999,
        "originalPrice": 2800,
        "rating": 4.9,
        "reviewCount": 38,
        "images": get_rel_images('eyeglassimages/YUNYI RS 1999 COLRS  BLUE , LIGHT PURPLE , BLACK 2 TONE , L.PINK, DARK BROWN'),
        "description": "Vibrant and flexible daily spectacle frames made with ultra-light composite polymer. Features a rich palette of two-tone and pastel hues designed for modern youth, women, and professionals.",
        "features": [
            "Featherlight composite construction for 12+ hour daily screen wear",
            "5 attractive colorways: Blue, Light Purple, Black 2-Tone, Light Pink, and Dark Brown",
            "Ergonomic nose bridge distribution prevents slipping",
            "Doctor approved for students, laptop workers, and progressive lenses"
        ],
        "inStock": True,
        "isNew": True,
        "isBestSeller": True,
        "frameShape": "round",
        "frameMaterial": "Flexible Composite Polymer",
        "rimType": "Full Rim",
        "availableColors": [
            {"name": "Cerulean Blue", "hex": "#2563eb"},
            {"name": "Light Lavender Purple", "hex": "#c084fc"},
            {"name": "Black Two-Tone Fade", "hex": "#171717"},
            {"name": "Soft Light Pink", "hex": "#f9a8d4"},
            {"name": "Dark Walnut Brown", "hex": "#582f0e"}
        ],
        "reviews": []
    }
]

# Color contacts (6 new shades in Optiano Gorgeous)
color_contacts_new = [
    {
        "id": "opt-gor-crystal-gray",
        "name": "Optiano Gorgeous — Crystal Gray",
        "sku": "OPT-GOR-03",
        "category": "color-contacts",
        "subCategory": "Optiano Gorgeous Collection",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3850,
        "originalPrice": 4800,
        "rating": 5.0,
        "reviewCount": 18,
        "images": [
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/CRYSTAL GRAY/WhatsApp Image 2026-10-19 at 4.46.27 PM.jpeg",
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/CRYSTAL GRAY/WhatsApp Image 2026-10-19 at 4.46.27 PM (1).jpeg",
            *guides
        ],
        "description": "Crystal Gray shade from the Optiano Gorgeous Collection. Premium South Korean cosmetic lenses featuring cool crystalline grey limbal definition. Globally safety approved with medical-grade Korean hydrogel for long-lasting hydration.",
        "features": [
            "Quarterly 3-Month comfortable wear cycle",
            "High moisture retention (40%) hydrophilic hydrogel",
            "Base Curve: 8.6 mm | Diameter: 14.5 mm",
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Includes Federal Optical sterile lens case & guide instructions"
        ],
        "inStock": True,
        "disposability": "three-month",
        "lensColor": "Grey",
        "availableColors": [{"name": "Crystal Gray", "hex": "#94a3b8"}],
        "reviews": []
    },
    {
        "id": "opt-gor-misty-blue",
        "name": "Optiano Gorgeous — Misty Blue",
        "sku": "OPT-GOR-04",
        "category": "color-contacts",
        "subCategory": "Optiano Gorgeous Collection",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3850,
        "originalPrice": 4800,
        "rating": 5.0,
        "reviewCount": 21,
        "images": [
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/MISTY BLUE/WhatsApp Image 2026-10-19 at 4.51.29 PM.jpeg",
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/MISTY BLUE/WhatsApp Image 2026-10-19 at 4.51.30 PM.jpeg",
            *guides
        ],
        "description": "Misty Blue shade from the Optiano Gorgeous Collection. Ethereal sky-blue iris blend with soft outer ring blending naturally with dark and light eyes. Made in South Korea with certified biocompatible hydrogel.",
        "features": [
            "Quarterly 3-Month comfortable wear cycle",
            "High moisture retention (40%) hydrophilic hydrogel",
            "Base Curve: 8.6 mm | Diameter: 14.5 mm",
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Includes Federal Optical sterile lens case & guide instructions"
        ],
        "inStock": True,
        "disposability": "three-month",
        "lensColor": "Blue",
        "availableColors": [{"name": "Misty Blue", "hex": "#60a5fa"}],
        "reviews": []
    },
    {
        "id": "opt-gor-olivine",
        "name": "Optiano Gorgeous — Olivine",
        "sku": "OPT-GOR-05",
        "category": "color-contacts",
        "subCategory": "Optiano Gorgeous Collection",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3850,
        "originalPrice": 4800,
        "rating": 5.0,
        "reviewCount": 16,
        "images": [
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/OLIVINE/WhatsApp Image 2026-10-19 at 4.47.56 PM.jpeg",
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/OLIVINE/WhatsApp Image 2026-10-19 at 4.47.57 PM.jpeg",
            *guides
        ],
        "description": "Olivine shade from the Optiano Gorgeous Collection. Deep olive and warm hazel undertones create an alluring, authentic earthy glance. Premium Korean hydrogel with high oxygen transmission.",
        "features": [
            "Quarterly 3-Month comfortable wear cycle",
            "High moisture retention (40%) hydrophilic hydrogel",
            "Base Curve: 8.6 mm | Diameter: 14.5 mm",
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Includes Federal Optical sterile lens case & guide instructions"
        ],
        "inStock": True,
        "disposability": "three-month",
        "lensColor": "Green",
        "availableColors": [{"name": "Olivine Green", "hex": "#65a30d"}],
        "reviews": []
    },
    {
        "id": "opt-gor-silk-green",
        "name": "Optiano Gorgeous — Silk Green",
        "sku": "OPT-GOR-06",
        "category": "color-contacts",
        "subCategory": "Optiano Gorgeous Collection",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3850,
        "originalPrice": 4800,
        "rating": 5.0,
        "reviewCount": 24,
        "images": [
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/SILK GREEN/WhatsApp Image 2026-10-19 at 4.49.39 PM.jpeg",
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/SILK GREEN/WhatsApp Image 2026-10-19 at 4.49.39 PM (1).jpeg",
            *guides
        ],
        "description": "Silk Green shade from the Optiano Gorgeous Collection. Silky emerald and jade tones radiating from pupil to iris perimeter with captivating vibrance. South Korean safety certified.",
        "features": [
            "Quarterly 3-Month comfortable wear cycle",
            "High moisture retention (40%) hydrophilic hydrogel",
            "Base Curve: 8.6 mm | Diameter: 14.5 mm",
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Includes Federal Optical sterile lens case & guide instructions"
        ],
        "inStock": True,
        "disposability": "three-month",
        "lensColor": "Green",
        "availableColors": [{"name": "Silk Green", "hex": "#10b981"}],
        "reviews": []
    },
    {
        "id": "opt-gor-sterling-gray",
        "name": "Optiano Gorgeous — Sterling Gray",
        "sku": "OPT-GOR-07",
        "category": "color-contacts",
        "subCategory": "Optiano Gorgeous Collection",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3850,
        "originalPrice": 4800,
        "rating": 5.0,
        "reviewCount": 27,
        "images": [
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/sterling gray/WhatsApp Image 2026-10-19 at 4.47.04 PM.jpeg",
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/sterling gray/WhatsApp Image 2026-10-19 at 4.47.05 PM.jpeg",
            *guides
        ],
        "description": "Sterling Gray shade from the Optiano Gorgeous Collection. Striking metallic sterling grey iris gradient designed to brighten and enlarge eye contours seamlessly.",
        "features": [
            "Quarterly 3-Month comfortable wear cycle",
            "High moisture retention (40%) hydrophilic hydrogel",
            "Base Curve: 8.6 mm | Diameter: 14.5 mm",
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Includes Federal Optical sterile lens case & guide instructions"
        ],
        "inStock": True,
        "disposability": "three-month",
        "lensColor": "Grey",
        "availableColors": [{"name": "Sterling Gray", "hex": "#475569"}],
        "reviews": []
    },
    {
        "id": "opt-gor-tiffany-gray",
        "name": "Optiano Gorgeous — Tiffany Gray",
        "sku": "OPT-GOR-08",
        "category": "color-contacts",
        "subCategory": "Optiano Gorgeous Collection",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3850,
        "originalPrice": 4800,
        "rating": 5.0,
        "reviewCount": 19,
        "images": [
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/TIFFANY GRAY/WhatsApp Image 2026-10-19 at 4.48.51 PM.jpeg",
            "/eyeglassimages/color contact lenses/OPTIANO GORGEOUS COLLECTION rs 3850/TIFFANY GRAY/WhatsApp Image 2026-10-19 at 4.48.51 PM (1).jpeg",
            *guides
        ],
        "description": "Tiffany Gray shade from the Optiano Gorgeous Collection. Exclusive aqua-grey fusion creating a jewel-like luminosity in daylight and evening lighting.",
        "features": [
            "Quarterly 3-Month comfortable wear cycle",
            "High moisture retention (40%) hydrophilic hydrogel",
            "Base Curve: 8.6 mm | Diameter: 14.5 mm",
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Includes Federal Optical sterile lens case & guide instructions"
        ],
        "inStock": True,
        "disposability": "three-month",
        "lensColor": "Grey",
        "availableColors": [{"name": "Tiffany Gray", "hex": "#0284c7"}],
        "reviews": []
    }
]

print(f"Verified: {len(accessories)} accessories, {len(sunglasses)} sunglasses, {len(eyeglasses)} eyeglasses, {len(color_contacts_new)} color contacts.")

