import os
import json
import re

base_public = os.path.abspath('public')

def get_rel_images(folder_rel):
    folder_abs = os.path.join(base_public, folder_rel.replace('/', os.sep))
    if not os.path.exists(folder_abs):
        raise FileNotFoundError(f"Missing: {folder_abs}")
    files = [f for f in sorted(os.listdir(folder_abs)) if os.path.isfile(os.path.join(folder_abs, f)) and not f.startswith('.')]
    return [f"/{folder_rel.replace(os.sep, '/')}/{f}" for f in files]

common_clear_image = "/eyeglassimages/Transparent Lenses/use this image wuth every transparent lense category .jpeg"
guides = [
    "/eyeglassimages/contact-lens-guides/guide-how-to-wear.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-remove.jpeg",
    "/eyeglassimages/contact-lens-guides/guide-how-to-clean.jpeg"
]

def make_clear_images(specific_images):
    res = list(specific_images)
    if common_clear_image not in res:
        res.append(common_clear_image)
    for g in guides:
        if g not in res:
            res.append(g)
    return res

# 1. Clear contacts products
clear_contacts = [
    {
        "id": "cl-acu-01",
        "name": "ACUVUE 1-Day Moist Daily Disposable (30 Pack)",
        "sku": "CL-ACU-01",
        "category": "clear-contacts",
        "subCategory": "Daily Disposable Clear Lenses",
        "gender": "unisex",
        "brand": "Johnson & Johnson Acuvue",
        "price": 11500,
        "originalPrice": 13500,
        "rating": 5.0,
        "reviewCount": 42,
        "images": make_clear_images(["/eyeglassimages/Transparent Lenses/Acuvue 1 day moisy rs 11500.jpeg"]),
        "description": "ACUVUE 1 day moist are soft and comfy daily disposable contact lenses. These lenses add a beautiful glow to your natural eyes without letting anyone know that you have weak eye-sight. 1 day acuvue moist daily disposable contact lenses are easy to wear and comfortable to hold for the entire day. They have 58% water content in their making that guarantees hydration and avoids any kind of redness and irritation. The best price Acuvue 1 day Moist lenses are available in a wide range of power.",
        "features": [
            "Content: 58% Water for continuous all-day moisture",
            "Diameter: 14.2mm | Base Curve: 8.5mm",
            "Power Range: -0.50D to -6.00D (0.25 steps) & -6.50D to -10.00D (0.50 steps)",
            "Lacreon Technology permanently embeds moisture-rich wetting agent",
            "Class 2 UV blocking protects cornea and ocular surfaces",
            "Supplied with Federal Optical sterile case & clinic care guide"
        ],
        "inStock": True,
        "isBestSeller": True,
        "disposability": "daily",
        "lensWaterContent": "58% Water",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.5 mm",
        "lensPowerRange": "-0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-bio-55",
        "name": "CooperVision Biomedics 55 Premier Aspheric",
        "sku": "CL-BIO-55",
        "category": "clear-contacts",
        "subCategory": "Monthly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "CooperVision",
        "price": 3500,
        "originalPrice": 4200,
        "packOptions": [
            {"id": "1-pair", "name": "1 Pair of Lenses (2 Lenses)", "price": 3500},
            {"id": "2-pairs", "name": "2 Pairs of Lenses (4 Lenses)", "price": 6500, "savingsBadge": "Save Rs. 500"},
            {"id": "3-pairs", "name": "3 Pairs / Box (6 Lenses)", "price": 8500, "savingsBadge": "Save Rs. 2,000"}
        ],
        "rating": 4.9,
        "reviewCount": 38,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/BIOMEDICS 55')),
        "description": "CooperVision Biomedics 55 premier aspheric contact lenses are designed to effectively control the spherical aberration in the lens and human eye. Spherical aberration is the inability of a lens to focus light on a common point. Biomedics 55 contact lenses offer excellent wearing comfort, enhanced image quality and UV blocking protection. They come in a 6 contact lenses packaging and are available at best prices in Pakistan.",
        "features": [
            "Content: 38% Water for structural stability and deposit resistance",
            "Diameter: 14.2mm | Base Curve: 8.6mm",
            "Power Range: -0.50D to -6.00D (0.25 steps), -6.50D to -10.00D (0.50 steps), +0.50 to +6.00D",
            "Aspheric optical curvature neutralizes spherical aberrations",
            "Tapered edge design provides effortless, frictionless blinking",
            "Includes Federal Optical sterile case and optometrist consultation"
        ],
        "inStock": True,
        "isBestSeller": True,
        "disposability": "monthly",
        "lensWaterContent": "38% Water",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.6 mm",
        "lensPowerRange": "-0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps) | +0.50 to +6.00D (0.25 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-bnl-59",
        "name": "Bausch & Lomb SofLens 59 Monthly Contact Lenses",
        "sku": "CL-BNL-59",
        "category": "clear-contacts",
        "subCategory": "Monthly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "Bausch & Lomb",
        "price": 4800,
        "originalPrice": 5800,
        "packOptions": [
            {"id": "1-pair", "name": "1 Pair of Lenses (2 Lenses)", "price": 4800},
            {"id": "2-pairs", "name": "2 Pairs of Lenses (4 Lenses)", "price": 9000, "savingsBadge": "Save Rs. 600"},
            {"id": "3-pairs", "name": "3 Pairs / Box (6 Lenses)", "price": 13000, "savingsBadge": "Save Rs. 1,400"}
        ],
        "rating": 4.9,
        "reviewCount": 31,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/Bausch & Lomb Soflens 59')),
        "description": "Bausch + Lomb SofLens59 contact lenses deliver clear vision with the everyday comfort you have been looking for. Bausch and Lomb Soflens 59 are light and convenient monthly disposable contact lenses made for both men and women. You can say goodbye to your dull and dry eyes and achieve protected and moistened eyes with these branded contact lenses; they guard against the sun and prevent dehydration in the eyes. Buy these Bausch & Lomb Soflens 59 with 59% Water content and 41% Hilafilcon B in its composition that guarantees you comfortable wear the entire day for a long time.",
        "features": [
            "Composition: 59% Water, 41% Hilafilcon B polymer",
            "Diameter: 14.2mm | Base Curve: 8.60mm",
            "Power Range: -0.50D to -6.00D (0.25 steps) | -6.50D to -9.00D (0.50 steps)",
            "Protein-resistant polymer material minimizes buildup and irritation",
            "Time-tested edge profile provides exceptional wearing ease",
            "Certified authentic Bausch + Lomb Pakistan supply"
        ],
        "inStock": True,
        "isBestSeller": True,
        "disposability": "monthly",
        "lensWaterContent": "59% Water, 41% Hilafilcon B",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.60 mm",
        "lensPowerRange": "-0.50D to -6.00D (0.25 steps) | -6.50D to -9.00D (0.50 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-ava-01",
        "name": "CooperVision Avaira Vitality Monthly Silicone Hydrogel",
        "sku": "CL-AVA-01",
        "category": "clear-contacts",
        "subCategory": "Monthly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "CooperVision",
        "price": 4300,
        "originalPrice": 5200,
        "packOptions": [
            {"id": "1-pair", "name": "1 Pair of Lenses (2 Lenses)", "price": 4300},
            {"id": "2-pairs", "name": "2 Pairs of Lenses (4 Lenses)", "price": 8200, "savingsBadge": "Save Rs. 400"},
            {"id": "3-pairs", "name": "3 Pairs / Box (6 Lenses)", "price": 12000, "savingsBadge": "Save Rs. 900"}
        ],
        "rating": 5.0,
        "reviewCount": 27,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/Avaira Vitality rs 4300')),
        "description": "The Avaira Vitality monthly disposable silicone hydrogel contact lenses are manufactured by the world’s leading contact lens manufacturer CooperVision. These transparent lenses provide long-lasting comfort and clear vision. The manufacturer has used the same optical features as in Biofinity contact lenses. They are produced with 3rd generation Silicone Hydrogel material ensuring better lens-wearing experience. Avaira Vitality contact lenses are available in transparent color, and these are monthly disposable lenses. These superior performance lenses are available at best prices only.",
        "features": [
            "3rd Generation Silicone Hydrogel material with natural high wettability",
            "Class 1 UV filter blocks >90% UVA and >99% UVB rays",
            "High oxygen transmissibility (Dk/t) for white, healthy eyes",
            "Aberration neutralizing system for high-definition clarity",
            "Soft and flexible lens geometry for quick adaptation"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "monthly",
        "lensWaterContent": "55% Water",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.4 mm",
        "lensPowerRange": "-0.50D to -6.00D (0.25 steps) | -6.50D to -12.00D (0.50 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-avt-02",
        "name": "CooperVision Avaira Vitality Toric (For Astigmatism)",
        "sku": "CL-AVT-02",
        "category": "clear-contacts",
        "subCategory": "Toric Astigmatism Clear Lenses",
        "gender": "unisex",
        "brand": "CooperVision",
        "price": 6500,
        "originalPrice": 7800,
        "rating": 5.0,
        "reviewCount": 19,
        "isToric": True,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/Avaira Vitality Toric RS 6500')),
        "description": "CooperVision Avaira Vitality Toric monthly silicone hydrogel contact lenses deliver stable, crisp vision for astigmatic eyes. Engineered with Optimized Toric Lens Geometry to ensure quick orientation upon blinking and minimal rotation during reading or sports.",
        "features": [
            "Diameter: 14.5mm | Base Curve: 8.5mm",
            "Sphere Power: -0.75 to -8.00D (0.50D steps after -6.00D)",
            "Cylinder Power: -0.75D, -1.25D, -1.75D, -2.25D, -2.75D, -3.25D, -3.75D",
            "Axis: 10° to 180° in 10° precise steps",
            "High Power Options: Sphere -0.75 to -8.00 with Cyl -2.75, -3.25, -3.75 (Axis 10, 20, 160, 170, 180)",
            "Optimized Toric Geometry locks lens firmly in correct meridian"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "monthly",
        "lensWaterContent": "55% Water",
        "lensDiameter": "14.5 mm",
        "lensBaseCurve": "8.5 mm",
        "lensPowerRange": "Sph -0.75 to -8.00D | Cyl -0.75 to -3.75D | Axis 10° to 180°",
        "availableColors": [{"name": "Clear Toric", "hex": "#bae6fd"}],
        "reviews": []
    },
    {
        "id": "cl-flx-01",
        "name": "Flexcon Extended Wear Yearly Disposable Contact Lenses",
        "sku": "CL-FLX-01",
        "category": "clear-contacts",
        "subCategory": "Yearly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "Flexcon",
        "price": 7700,
        "originalPrice": 9200,
        "packOptions": [
            {"id": "minus-power", "name": "Standard Minus Powers (-)", "price": 7700},
            {"id": "plus-power", "name": "Plus Powers (+) Range", "price": 8300, "savingsBadge": "High Power"}
        ],
        "rating": 4.8,
        "reviewCount": 22,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/FLEXON (With descriptipon) RS 7700')),
        "description": "Flexcon extended wear contact lenses are comfortable and secure for those who want to live their lives conveniently without having to carry the weight of glasses with them everywhere. Flexcon lenses are safe and moist yearly disposable contact lenses that you can wear all day long, from the office to late-night movies with friends. They provide a barrier to your eyes to prevent any tiredness and eye-fatigue. We are offering these branded contact lenses in a wide power range to present everyone an opportunity to try these best vision-correcting contact lenses. Buy these Flexcon contact lenses today at best prices to prevent dehydration.",
        "features": [
            "Content: 55% Water for all-day comfort and ocular breathability",
            "Diameter: 14.0mm | Base Curve: 8.4mm",
            "Minus Range: -0.50D to -6.00D (0.25 steps) & -6.50D to -20.00D (0.50 steps)",
            "Plus Range (+): +1.00 to +6.00D (0.25 steps) & +6.00 to +20.00D (0.50 steps)",
            "Yearly durability with reinforced tear resistance",
            "Certified by Federal Optical Karachi optometrists"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "yearly",
        "lensWaterContent": "55% Water",
        "lensDiameter": "14.0 mm",
        "lensBaseCurve": "8.4 mm",
        "lensPowerRange": "-0.50D to -20.00D | +1.00D to +20.00D",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-bio-1d",
        "name": "CooperVision Biomedics 1 Day Extra (30 Lenses)",
        "sku": "CL-BIO-1D",
        "category": "clear-contacts",
        "subCategory": "Daily Disposable Clear Lenses",
        "gender": "unisex",
        "brand": "CooperVision",
        "price": 9000,
        "originalPrice": 10500,
        "rating": 4.9,
        "reviewCount": 18,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/Biomedics 1 Day Extra ( with Description) Rs 9000')),
        "description": "30 Lenses in 1 Box CooperVision Biomedics 1 Day Extra is a trusted name in the leading contact lenses brands. It is designed to deliver the most natural, comfortable lens wearing experience. Biomedics 1 day extra are available in a pack of 30 daily disposable contact lenses.",
        "features": [
            "30 sterile daily disposable lenses per box (15 pairs)",
            "Material: Oculfilcon D with high natural wettability",
            "Diameter: 14.2mm | Base Curve: 8.6mm",
            "Power Range: -0.75D to -6.00D (0.25 steps) & -6.50D to -8.00D (0.50 steps)",
            "Ultra-thin tapered edge profile prevents eyelid friction",
            "No lens care solution or storage case required — insert and dispose"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "daily",
        "lensWaterContent": "55% Water (Oculfilcon D)",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.6 mm",
        "lensPowerRange": "-0.75D to -6.00D (0.25 steps) | -6.50D to -8.00D (0.50 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-vis-01",
        "name": "Visicon Transparent Monthly Wear Contact Lenses",
        "sku": "CL-VIS-01",
        "category": "clear-contacts",
        "subCategory": "Monthly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "Visicon",
        "price": 4200,
        "originalPrice": 5000,
        "rating": 4.8,
        "reviewCount": 16,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/VISICON(with descriotion ) RS 4200')),
        "description": "Visicon contact lenses are transparent monthly wear lenses engineered for exceptional optical clarity and reliable moisture equilibrium. Specially crafted for South Asian climates to resist deposit adhesion.",
        "features": [
            "Content: 38% Water for structural resilience and clarity",
            "Diameter: 14.0mm | Base Curve: 8.5mm",
            "Power Range: -0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps)",
            "Biocompatible polymer for dependable all-day wearing comfort",
            "Supplied with Federal Optical sterile case & hygiene guide"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "monthly",
        "lensWaterContent": "38% Water",
        "lensDiameter": "14.0 mm",
        "lensBaseCurve": "8.5 mm",
        "lensPowerRange": "-0.50D to -6.00D (0.25 steps) | -6.50D to -10.00D (0.50 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-foc-01",
        "name": "Focus DAILIES All Day Comfort (30 Daily Lenses)",
        "sku": "CL-FOC-01",
        "category": "clear-contacts",
        "subCategory": "Daily Disposable Clear Lenses",
        "gender": "unisex",
        "brand": "Focus Dailies",
        "price": 10400,
        "originalPrice": 12500,
        "rating": 5.0,
        "reviewCount": 26,
        "images": make_clear_images(get_rel_images('eyeglassimages/Transparent Lenses/Focus DAILIES with description rs 10400')),
        "description": "Focus dailies all day comfort are daily disposable contact lenses. Focus Dailies contact lenses are transparent lenses and offer all-day comfort to its users. Either you are suffering from myopia or face difficulties in seeing the objects near you, focus dailies lenses are preferably the right choice for both conditions. As the name indicates these lenses can be disposed daily and cannot be used more than once. You can experience the feeling of wearing a new lens everyday without any inconvenience. Daily wear: comfortable for typical wear of 8-10 hours. Replacement: Daily disposable. Pair packaging: supplied as matched pairs in sterile vials.",
        "features": [
            "Blink-activated moisture release technology",
            "Content: Standard water (69% high hydration)",
            "Diameter: 14.0mm | Base Curve: 8.7mm",
            "Power Range: -0.50D to -6.00D (0.25 steps)",
            "Plano + prescription powers confirmed via Federal Optical WhatsApp",
            "Brand new lens freshness every morning"
        ],
        "inStock": True,
        "isBestSeller": True,
        "disposability": "daily",
        "lensWaterContent": "69% Water",
        "lensDiameter": "14.0 mm",
        "lensBaseCurve": "8.7 mm",
        "lensPowerRange": "-0.50D to -6.00D (0.25 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-frk-58",
        "name": "FreshKon 58 UV Monthly Clear Lenses",
        "sku": "CL-FRK-58",
        "category": "clear-contacts",
        "subCategory": "Monthly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "FreshKon",
        "price": 2500,
        "originalPrice": 3200,
        "packOptions": [
            {"id": "1-pair", "name": "1 Pair (2 Lenses)", "price": 2500},
            {"id": "pack-6", "name": "Pack of 6 Lenses (3 Pairs)", "price": 6500, "savingsBadge": "Save Rs. 1,000"}
        ],
        "rating": 4.8,
        "reviewCount": 15,
        "images": make_clear_images([
            "/eyeglassimages/Transparent Lenses/freshkon 58 uv 1 pair rs 2500.jpeg",
            "/eyeglassimages/Transparent Lenses/Freshkon 58 UV Pack OF 6 rs 6500.jpeg"
        ]),
        "description": "FreshKon 58 UV monthly clear contact lenses combine a 58% water content matrix with integrated UV blocking to shield eyes from sun exposure while keeping lenses supple and hydrated.",
        "features": [
            "58% Water hydrophilic material ensures silky glide on cornea",
            "Available as single pair (Rs. 2,500) or value pack of 6 (Rs. 6,500)",
            "Diameter: 14.2mm | Base Curve: 8.5mm",
            "Integrated UV protection guards against ocular fatigue",
            "Smooth deposit-resistant surface coating"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "monthly",
        "lensWaterContent": "58% Water",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.5 mm",
        "lensPowerRange": "-0.50D to -10.00D (0.25 & 0.50 steps)",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-opt-sc",
        "name": "Optiano See Clear Monthly Transparent Lenses",
        "sku": "CL-OPT-SC",
        "category": "clear-contacts",
        "subCategory": "Monthly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 2500,
        "originalPrice": 3200,
        "rating": 4.8,
        "reviewCount": 21,
        "images": make_clear_images(["/eyeglassimages/Transparent Lenses/OPTIANO SEE CLEAR RS 2500.jpeg"]),
        "description": "Optiano See Clear monthly clear contact lenses manufactured in South Korea with globally safety approved medical polymers. Crystal clarity, gentle hydration, and effortless all-day wear.",
        "features": [
            "Made in South Korea — Globally Safety Approved (CE, ISO, KFDA)",
            "Diameter: 14.2mm | Base Curve: 8.6mm | Water: 42%",
            "Precision aspheric front surface reduces glare and halos",
            "Includes Federal Optical sterile lens storage case"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "monthly",
        "lensWaterContent": "42% Water",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.6 mm",
        "lensPowerRange": "-0.50D to -10.00D",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-opt-ex",
        "name": "Optiano EX South Korea Precision Clear Lenses",
        "sku": "CL-OPT-EX",
        "category": "clear-contacts",
        "subCategory": "Quarterly Clear Contact Lenses",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 3450,
        "originalPrice": 4200,
        "rating": 4.9,
        "reviewCount": 14,
        "images": make_clear_images(["/eyeglassimages/Transparent Lenses/OPTIANO EX RS 3450.jpeg"]),
        "description": "Optiano EX high-definition clear contact lenses. Engineered with high-molecular polymer technology from South Korea for extended 3-month wear life and exceptional tear-film stability.",
        "features": [
            "3-Month comfortable wearing cycle",
            "South Korean precision lathe-cut surfacing",
            "Diameter: 14.2mm | Base Curve: 8.6mm | Water: 40%",
            "Deposit-repelling surface keeps vision crystal-clear"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "three-month",
        "lensWaterContent": "40% Water",
        "lensDiameter": "14.2 mm",
        "lensBaseCurve": "8.6 mm",
        "lensPowerRange": "-0.50D to -10.00D",
        "availableColors": [{"name": "Clear Transparent", "hex": "#e0f2fe"}],
        "reviews": []
    },
    {
        "id": "cl-opt-tr",
        "name": "Optiano Toric Astigmatism Clear Lenses (South Korea)",
        "sku": "CL-OPT-TR",
        "category": "clear-contacts",
        "subCategory": "Toric Astigmatism Clear Lenses",
        "gender": "unisex",
        "brand": "Optiano",
        "price": 6000,
        "originalPrice": 7200,
        "rating": 5.0,
        "reviewCount": 11,
        "isToric": True,
        "images": make_clear_images(["/eyeglassimages/Transparent Lenses/OPTIANO TORIC rs 6000.jpeg"]),
        "description": "Optiano Toric clear contact lenses for astigmatism. Manufactured in South Korea with dynamic stabilization zones to correct cylindrical blur without lens drift.",
        "features": [
            "Prism ballast stabilization keeps cylinder axis aligned",
            "Diameter: 14.5mm | Base Curve: 8.6mm",
            "Cylinder & Axis correction tailored to your optical prescription",
            "South Korean certified medical-grade hydrogel"
        ],
        "inStock": True,
        "isBestSeller": False,
        "disposability": "three-month",
        "lensWaterContent": "40% Water",
        "lensDiameter": "14.5 mm",
        "lensBaseCurve": "8.6 mm",
        "lensPowerRange": "Sph -0.50 to -8.00D | Cyl -0.75 to -2.75D",
        "availableColors": [{"name": "Clear Toric", "hex": "#bae6fd"}],
        "reviews": []
    }
]

print(f"Generated {len(clear_contacts)} clear contacts products.")

