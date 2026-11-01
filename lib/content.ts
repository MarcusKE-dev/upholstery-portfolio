export type Section = { heading: string; paragraphs: string[] }
export type Service = { slug: string; title: string; description: string; intro: string; sections: Section[]; faqs: [string, string][]; related: string[] }
export type Guide = { slug: string; title: string; description: string; intro: string; service: string; published: string; sections: Section[]; table?: { head: string[]; rows: string[][] }; sources?: {label: string; url: string}[] }
export const services: Service[] = [
  {
    "slug": "sofa-reupholstery",
    "title": "Sofa reupholstery and furniture restoration",
    "description": "Explore sofa reupholstery in Nairobi: assess the frame, cushions and fabric, compare restoration with replacement, and prepare an enquiry.",
    "intro": "Reupholstery replaces a furniture covering and can include work on the padding and support beneath it. Charles' Interiors offers sofa upholstery, seating and furniture restoration in Nairobi. The work a particular piece needs depends on its condition.",
    "sections": [
      {
        "heading": "Start with the furniture beneath the fabric",
        "paragraphs": [
          "A worn cover and a damaged structure are different problems. A sofa can look tired while its frame remains serviceable; a newer-looking piece can have loose joints or failing seat support. Photographs help start the conversation, but hidden damage may require a closer assessment.",
          "Describe movement in the arms, creaks, uneven seating and any damage you can see. Ask which parts can be retained, repaired or replaced before agreeing on the scope."
        ]
      },
      {
        "heading": "Seating, padding and support",
        "paragraphs": [
          "The seating range includes sofas, dining chairs, accent seating, loose covers and ottomans. Discuss the specific furniture rather than assuming every construction can be rebuilt in the same way.",
          "Sagging may come from the cushion filling, webbing or other support, or a combination. Replacing fabric alone will not resolve all these causes. Ask for an explanation of the proposed work on the frame, padding and seat support."
        ]
      },
      {
        "heading": "Choose a covering for the way you use the room",
        "paragraphs": [
          "Compare actual upholstery samples for texture, cleaning requirements, light exposure and everyday use. Pattern matching, pile direction and the shape of the piece can affect the amount of fabric needed. A material name alone does not establish suitability.",
          "For a frequently used family sofa, discuss the supplier specifications and care instructions alongside colour. Bring photographs of curtains, flooring and other furnishings if you want to coordinate them."
        ]
      },
      {
        "heading": "Reupholster or replace?",
        "paragraphs": [
          "Restoration may be worth assessing when the proportions suit the room, the frame can be made sound, or the furniture has personal value. Compare the complete proposed work with a replacement of suitable quality, including access and transport considerations.",
          "Replacement can be more practical when structural damage is extensive or the size and comfort no longer suit your needs. Reupholstery is not automatically cheaper."
        ]
      },
      {
        "heading": "Prepare a useful enquiry",
        "paragraphs": [
          "Send a full view, a rear view, close-ups of wear and any existing care labels. Include approximate width, depth and height, your location and the intended use. Describe whether you want a similar finish or a different look.",
          "Ask what the quotation includes and which details need inspection. Prices, collection, delivery and scheduling must be agreed for your project."
        ]
      }
    ],
    "faqs": [
      [
        "Can an existing sofa be reupholstered?",
        "Many upholstered sofas can be assessed for re-covering, but the frame, support system and construction determine the practical options. Share photos and describe any instability before deciding."
      ],
      [
        "What affects an upholstery quotation?",
        "Size, construction, fabric quantity and specification, pattern matching, padding and repairs all affect scope. Ask for an itemised explanation of the proposed work."
      ],
      [
        "Will new foam fix a sagging seat?",
        "Only if the filling is the cause. Failed webbing, springs or frame joints can also affect seating and need separate assessment."
      ]
    ],
    "related": [
      "reupholster-or-replace-sofa",
      "velvet-or-leather-upholstery",
      "tufting-foam-webbing"
    ]
  },
  {
    "slug": "upholstered-beds-headboards",
    "title": "Upholstered beds, headboards and cushions",
    "description": "Discuss upholstered beds, headboards and cushions in Nairobi, with practical guidance on measurements, fabric and tufted details.",
    "intro": "An upholstered headboard introduces a padded surface behind a bed; an upholstered bed can carry that finish around the base. Beds, headboards and scatter cushions are part of the existing Charles' Interiors furnishing range.",
    "sections": [
      {
        "heading": "Begin with the bed and the room",
        "paragraphs": [
          "Record the mattress size, bed-frame width and the space available on each side. Measure from the floor and note the mattress height, bedside tables, sockets and nearby windows. The visible height above the mattress matters as much as overall height.",
          "For an existing bed, provide photographs of the frame and its connections. Compatibility and fixing arrangements need confirmation before fabrication; a photograph alone cannot establish that a new headboard will fit."
        ]
      },
      {
        "heading": "Shape and upholstery detail",
        "paragraphs": [
          "For upholstered headboards and Chester-style beds, discuss a reference image, the proportions you prefer and whether a tufted finish suits your design. Availability of a particular shape or finish must be confirmed.",
          "A plain padded surface and a deeply tufted surface have different visual effects and cleaning access. Buttons, seams and edges should be considered with the room rather than chosen in isolation."
        ]
      },
      {
        "heading": "Fabric and everyday use",
        "paragraphs": [
          "Compare samples in the bedroom lighting. Consider contact with hair products, cleaning access and how the colour relates to bed linen. Ask for the precise fabric specification and care instructions.",
          "For cushions, discuss dimensions, filling, removable covers and where they will be used. A decorative cushion and a seat cushion need different decisions about shape and support."
        ]
      },
      {
        "heading": "What to send with an enquiry",
        "paragraphs": [
          "Include mattress and frame measurements, a room photograph, the desired visible headboard height and reference images. State whether you are adapting an existing bed or discussing a new upholstered piece.",
          "Ask which measurements require checking and which fixing, assembly or delivery arrangements are included. These are project details to agree, not assumptions to make from a style photograph."
        ]
      }
    ],
    "faqs": [
      [
        "Can a headboard fit my existing bed?",
        "It may be possible, but the frame, dimensions and fixing points need to be checked. Provide photographs of the connections and measurements before commissioning."
      ],
      [
        "Does a tufted finish change the feel?",
        "Tufting holds upholstery into a pattern of depressions and affects the surface shape. The padding and underlying construction also influence comfort."
      ]
    ],
    "related": [
      "tufting-foam-webbing",
      "coordinate-sofa-curtains-cushions",
      "upholstery-fabric-care"
    ]
  },
  {
    "slug": "curtains-blinds",
    "title": "Curtains, blinds and sheers",
    "description": "Explore curtains, blinds and sheers in Nairobi. Compare privacy, daylight and proportions and prepare measurements for a furnishing enquiry.",
    "intro": "Curtains, blinds and sheers offer different ways to manage daylight and dress a window. Charles' Interiors lists these window furnishings alongside upholstery, so they can be discussed in relation to the seating and textiles in a room.",
    "sections": [
      {
        "heading": "Decide what the window needs to do",
        "paragraphs": [
          "Start with the room: sleeping, working and sitting areas can require different levels of light control. Identify glare, overlooking and the times of day that privacy matters.",
          "Sheers soften daylight but do not guarantee privacy after dark. Curtains and blinds also vary by fabric opacity, coverage and gaps around the edges. Ask to see the proposed material rather than relying on the product name."
        ]
      },
      {
        "heading": "Compare the available types",
        "paragraphs": [
          "Options to discuss include curtains, sheers, Roman, roller and vertical blinds. Curtains bring folds and a wider fabric surface; roller blinds form a relatively simple plane; Roman blinds fold into sections. Confirm which current products and fabrics are available for your window.",
          "Layering a sheer with a heavier covering can provide more ways to adjust daylight. It also needs space for tracks or poles, stacks of fabric and opening access."
        ]
      },
      {
        "heading": "Measurements and practical constraints",
        "paragraphs": [
          "Record window width and height, the surrounding wall and any existing track or pole. Include doors, handles, radiators or furniture that might obstruct a covering. Distinguish the window opening from the full area you want to cover.",
          "These notes help an initial discussion. Final measuring and fitting responsibilities must be confirmed before ordering. Installation and automation are not assumed inclusions."
        ]
      },
      {
        "heading": "Coordinate the room",
        "paragraphs": [
          "View fabric samples near the window and beside upholstery in daylight and evening light. A curtain occupies a large surface, so its colour and pattern can affect how seating and cushions appear.",
          "Send room and window photographs, approximate measurements, existing hardware details and your priorities for privacy and light. Ask which hardware, lining, measuring and fitting items are included in a quotation."
        ]
      }
    ],
    "faqs": [
      [
        "Are sheers enough for privacy?",
        "That depends on the weave, light levels and viewing position. A room lit at night may be visible through a sheer; assess whether a second covering is needed."
      ],
      [
        "Should I measure the opening or the full wall?",
        "Record both for an initial discussion, and identify the current track or pole. The final dimensions depend on the intended coverage and mounting arrangement."
      ]
    ],
    "related": [
      "curtains-blinds-sheers",
      "coordinate-sofa-curtains-cushions"
    ]
  }
]
export const guides: Guide[] = [
  {
    "slug": "reupholster-or-replace-sofa",
    "title": "Should you reupholster or replace your sofa?",
    "description": "A balanced framework for comparing sofa reupholstery with replacement, from frame condition and sagging to fit, sentiment and the complete scope of work.",
    "intro": "Consider reupholstery when a sofa still fits your room and its structure is worth repairing. Consider replacement when damage, proportions or comfort make rebuilding a poor fit. Compare the full options after assessment rather than assuming either choice is cheaper.",
    "service": "sofa-reupholstery",
    "sections": [
      {
        "heading": "Separate surface wear from structural problems",
        "paragraphs": [
          "Faded fabric, worn armrests and open seams concern the covering. Sagging cushions may involve filling, support or both. Movement in the arms, uneven legs or creaking joints can indicate a structural issue, although a photograph cannot diagnose the cause.",
          "List what you notice during normal use. Do not remove covers or tip heavy furniture into an unsafe position just to inspect it. An upholsterer may need to examine concealed areas before defining the work."
        ]
      },
      {
        "heading": "Does the sofa still work for you?",
        "paragraphs": [
          "Measure the room and consider seating depth, seat height and access. Keeping a sofa that is too deep for comfortable sitting or too large for the space may leave the central problem unresolved even after an attractive new cover.",
          "Sentimental value and unusual proportions can make restoration worthwhile independently of price. State which features you want to preserve and which you want to change."
        ]
      },
      {
        "heading": "Compare like-for-like options",
        "paragraphs": [
          "Ask what would be retained and what would be repaired or replaced. Include fabric, padding, support, frame work and any agreed transport in the comparison. A fabric-only estimate cannot be compared fairly with a complete rebuild.",
          "For replacement, assess construction, dimensions, comfort, access and care needs. Keeping existing furniture avoids replacing the whole piece, but no environmental or financial saving can be quantified without knowing the work and alternatives."
        ]
      },
      {
        "heading": "When replacement may be the practical choice",
        "paragraphs": [
          "Extensive damage, unsuitable construction or a change in how the room is used may favour replacement. Ask whether the proposed repair can address the underlying fault and whether its scope remains reasonable for the result you want.",
          "If uncertainty remains, request clarification before committing. A lower initial price is not enough if the resulting sofa still fails to meet your needs."
        ]
      },
      {
        "heading": "Prepare for assessment",
        "paragraphs": [
          "Send overall views and close-ups of worn areas, approximate dimensions, any labels and a description of sagging or movement. Explain intended use and preferred materials. Ask which conclusions are provisional until inspection."
        ]
      }
    ],
    "table": {
      "head": [
        "What you notice",
        "What to discuss"
      ],
      "rows": [
        [
          "Worn covering, comfortable shape",
          "Fabric replacement and condition beneath the cover"
        ],
        [
          "Sagging or uneven seating",
          "Filling, seat support and frame assessment"
        ],
        [
          "Furniture no longer fits the room",
          "Whether restoration can address size and use"
        ],
        [
          "Personal or sentimental value",
          "Features worth preserving and realistic repair scope"
        ]
      ]
    },
    "published": "2026-10-27"
  },
  {
    "slug": "velvet-or-leather-upholstery",
    "title": "Velvet or leather for upholstery?",
    "description": "Compare velvet and leather by feel, appearance, household use, finish and care rather than assuming one material always performs better.",
    "intro": "Choose between velvet and leather by comparing the actual material specification, finish and care requirements. Velvet describes a piled textile construction; leather is a hide material with different grades and finishes. Neither name alone predicts durability or easy maintenance.",
    "service": "sofa-reupholstery",
    "sections": [
      {
        "heading": "Appearance and texture",
        "paragraphs": [
          "Velvet has a raised pile that catches light differently when viewed or brushed in different directions. A sample can look lighter on one side of a room and darker on another. Check it in the orientation in which it will be upholstered.",
          "Leather appearance varies with surface treatment, grain and colouring. Natural variation may be part of the chosen finish, while other finishes appear more uniform. Confirm the supplied material rather than judging from a catalogue photograph."
        ]
      },
      {
        "heading": "Think about your household",
        "paragraphs": [
          "Describe frequent seating, pets, children, food and sunlight to the supplier. Ask how the specific covering responds to rubbing, scratching, marking and fading. A general claim that all velvet is delicate or all leather is hard-wearing will not answer these questions.",
          "Velvet fibres and backing differ between products. Leather finishes differ too. Request upholstery suitability and care information for the exact sample, including any relevant test specifications and their limitations."
        ]
      },
      {
        "heading": "Cleaning is a specification question",
        "paragraphs": [
          "Do not apply a textile cleaning method to leather or use a leather conditioner on every finish. Follow the material supplier’s instructions. Removable covers are not automatically machine washable.",
          "For velvet, ask how to manage pile marking and permitted cleaning. For leather, ask which cleaner, if any, is approved and whether a protective finish changes the routine. Test only as instructed by the manufacturer."
        ]
      },
      {
        "heading": "Check the sample on your furniture",
        "paragraphs": [
          "Take the room lighting, shape and seams into account. Deep folds, buttons and curved arms change how a material looks. Ask how pile direction or hide layout affects cutting and the final appearance.",
          "If you cannot identify an existing covering, send its label or ask for assessment. Do not assume a leather-like surface is leather; coated and synthetic coverings require their own instructions."
        ]
      }
    ],
    "table": {
      "head": [
        "Decision",
        "Velvet",
        "Leather"
      ],
      "rows": [
        [
          "Surface",
          "Raised textile pile",
          "Hide with a specified finish"
        ],
        [
          "Appearance",
          "Directional light and texture",
          "Grain and finish variation"
        ],
        [
          "Care",
          "Follow fibre and product instructions",
          "Follow finish-specific instructions"
        ],
        [
          "Best next step",
          "Compare an upholstery sample",
          "Confirm hide type and finish"
        ]
      ]
    },
    "published": "2026-10-27"
  },
  {
    "slug": "curtains-blinds-sheers",
    "title": "Curtains, blinds or sheers?",
    "description": "Compare curtains, blinds and sheers for light, privacy, layering and window proportions before choosing a covering.",
    "intro": "Start with the light and privacy you need. Curtains add folds and fabric coverage, blinds offer a more contained window treatment, and sheers soften daylight. Layering can combine these functions when the mounting space allows.",
    "service": "curtains-blinds",
    "sections": [
      {
        "heading": "Light control and privacy are different",
        "paragraphs": [
          "A sheer can filter daylight while leaving views partly open. Whether someone can see in depends on the material and the relative light inside and outside. Check evening conditions as well as daytime appearance.",
          "An opaque covering can provide more screening, but edge gaps and mounting position affect light entry. Blackout fabric is not a promise that the whole installed window will be completely dark."
        ]
      },
      {
        "heading": "Compare how each covering moves",
        "paragraphs": [
          "Curtains need space to stack at the sides and clearance from furniture. Roller blinds roll around a tube; Roman blinds gather into folds; other blind types have different operating and stacking arrangements.",
          "Consider access to handles, opening windows and balcony doors. Ask about safe operating arrangements, particularly where children may reach cords or loops. Confirm suitable hardware with the supplier."
        ]
      },
      {
        "heading": "Use layers for separate tasks",
        "paragraphs": [
          "A sheer and a heavier curtain can allow filtered daylight during the day and more screening later. The combination adds fabric, hardware and depth, so check clearance and how the window will look when both are open.",
          "For a small window, a simpler blind may suit the proportions. For a broad wall, curtains may help relate the window to surrounding seating. These are visual decisions rather than universal rules."
        ]
      },
      {
        "heading": "Measure before discussing the options",
        "paragraphs": [
          "Photograph the window and surrounding wall. Record the opening size, ceiling clearance and current pole or track. Mark obstacles and the coverage you want.",
          "Final sizes depend on mounting and product construction. Confirm who checks measurements, supplies hardware and fits the covering before an order is placed."
        ]
      }
    ],
    "table": {
      "head": [
        "Option",
        "Useful starting point",
        "Check before choosing"
      ],
      "rows": [
        [
          "Curtains",
          "Fabric folds and broad coverage",
          "Stacking space, lining and track"
        ],
        [
          "Blinds",
          "Contained treatment near a window",
          "Mounting depth and opening access"
        ],
        [
          "Sheers",
          "Softened daylight and layering",
          "Night-time privacy and weave"
        ],
        [
          "Layered coverings",
          "Separate daylight and screening options",
          "Hardware depth and clearance"
        ]
      ]
    },
    "published": "2026-10-27"
  },
  {
    "slug": "upholstery-fabric-care",
    "title": "How to care for upholstered furniture",
    "description": "A cautious upholstery care routine: identify the covering, follow its label, remove loose dust and respond to spills without applying one method to every material.",
    "intro": "Identify the covering and follow its manufacturer’s care instructions before cleaning. Gentle routine dust removal and prompt, careful spill response can help, but a method suitable for one upholstery fabric can damage another fabric or leather finish.",
    "service": "sofa-reupholstery",
    "sections": [
      {
        "heading": "Keep the material information",
        "paragraphs": [
          "Retain the fabric name, supplier specification and care label when furniture is upholstered. Photograph labels so they remain accessible. Ask for instructions for the exact product, including cushions, trims and leather finishes.",
          "If the covering is unknown, avoid experimenting with water, solvents, steam or household mixtures. A specialist can advise on identification and a suitable approach."
        ]
      },
      {
        "heading": "Routine care without overworking the surface",
        "paragraphs": [
          "Where the instructions permit, remove loose dust with an appropriate soft vacuum attachment and avoid snagging decorative details. Check crevices gently. Follow supplier advice on brushing pile and rotating loose cushions.",
          "Keep furniture away from avoidable heat and prolonged direct sun where practical. These precautions do not make a material fade-proof or prevent all changes from everyday use."
        ]
      },
      {
        "heading": "What to do after a spill",
        "paragraphs": [
          "For a liquid spill, gently blot with a clean absorbent cloth rather than rubbing it into a wider area. Do not soak the upholstery. Then consult the exact care guidance before adding a cleaning product.",
          "Sunbrella’s upholstery instructions include blotting as an early response and then give product-specific cleaning steps. Those later steps are for the specified Sunbrella fabrics, not permission to wash any sofa with soap or bleach.",
          "For an oily, coloured or unknown spill, or a delicate surface, seek specialist advice before treating it. Tell the cleaner what spilled and what, if anything, has already been applied."
        ]
      },
      {
        "heading": "Removable does not mean washable",
        "paragraphs": [
          "A zip may allow access to the cushion filling rather than indicate a washable cover. Unapproved washing can change fit, texture or colour. Read the instructions for both cover and filling.",
          "Leather needs finish-specific guidance; fabric shampoo and generic conditioners are not interchangeable. Confirm cleaning products with the supplier."
        ]
      },
      {
        "heading": "When to stop and ask for help",
        "paragraphs": [
          "Stop if colour transfers, a mark spreads, the surface changes or you cannot identify the covering. Photograph the area in good light and retain the product label. Cleaning and structural repair are different tasks, so describe sagging or broken supports separately."
        ]
      }
    ],
    "sources": [
      {
        "label": "Sunbrella: upholstery care and cleaning (for its specified fabrics)",
        "url": "https://global.sunbrella.com/en-us/how-to-clean/clean-sunbrella-upholstery"
      }
    ],
    "published": "2026-10-27"
  },
  {
    "slug": "coordinate-sofa-curtains-cushions",
    "title": "How to coordinate sofas, curtains and cushions",
    "description": "Practical ways to coordinate upholstery and window fabrics through palette, pattern scale, texture, proportions and room lighting.",
    "intro": "Start with the largest furnishing you plan to keep, then compare curtain and cushion samples beside it. A shared colour or texture can connect the room without matching every surface. Judge samples in the room’s changing light before committing.",
    "service": "curtains-blinds",
    "sections": [
      {
        "heading": "Choose an anchor",
        "paragraphs": [
          "The sofa, a patterned curtain or a rug can provide the starting palette. Identify one main colour, a quieter supporting colour and an accent if useful. There is no required number of colours; the aim is a relationship you can see across the room.",
          "If a sofa is staying, work from its actual fabric. A phone photograph can shift colour, so physical samples are more useful for a final decision."
        ]
      },
      {
        "heading": "Vary pattern scale",
        "paragraphs": [
          "Two strong patterns of similar size can compete when placed close together. Try a broader pattern on one surface with a smaller pattern or plain texture on another, then view the combination from normal seating distance.",
          "For example, a patterned curtain could share one colour with plain sofa upholstery, while a cushion introduces a smaller pattern. This is a planning example, not a completed client project."
        ]
      },
      {
        "heading": "Let texture do some of the work",
        "paragraphs": [
          "A room can feel varied with a restrained palette if surfaces differ in texture. Compare a smooth cover with a woven curtain or a soft pile cushion. Check practical cleaning and upholstery suitability along with appearance.",
          "Do not select a loosely woven or delicate fabric for a demanding seat simply because its texture works visually. Ask whether it is intended for that use."
        ]
      },
      {
        "heading": "Check proportions and light",
        "paragraphs": [
          "A curtain becomes a large surface when drawn, and a cushion cluster changes the usable seat area. Compare sizes against the actual furniture and leave comfortable space to sit.",
          "Place samples near windows and under evening lamps. Directional fabrics such as velvet can change in appearance with viewing angle. Keep samples together for more than a quick showroom comparison."
        ]
      },
      {
        "heading": "Build the scheme gradually",
        "paragraphs": [
          "Keep a small record of fabric names, dimensions and approved samples. Confirm the largest commitments first, then adjust smaller cushions. Ask about sample availability and material specifications before ordering.",
          "Photographs of the whole room, existing pieces and window measurements give a furnishing enquiry more context than isolated product images."
        ]
      }
    ],
    "published": "2026-10-27"
  },
  {
    "slug": "tufting-foam-webbing",
    "title": "Understanding tufting, foam and webbing",
    "description": "Understand what tufting, foam density, foam firmness and webbing do in upholstered furniture, and why sagging needs a proper assessment.",
    "intro": "Tufting shapes the upholstery surface, foam provides cushioning, and webbing can form part of the support underneath. They perform different jobs. A firm cushion is not proof of high-density foam, and a new cover cannot correct every support problem.",
    "service": "sofa-reupholstery",
    "sections": [
      {
        "heading": "Tufting: shaping the surface",
        "paragraphs": [
          "Tufting draws upholstery into repeated depressions, often secured with buttons or stitching. Diamond and other arrangements create different surface patterns. The depth, spacing, padding and fabric affect the result.",
          "Tufting is a construction detail rather than a guarantee of comfort or quality. Ask how the surface will be used and cleaned, especially on a seat or a headboard that is touched frequently."
        ]
      },
      {
        "heading": "Foam density and firmness describe different things",
        "paragraphs": [
          "Density expresses mass per unit volume. Firmness describes resistance to compression under a defined test. The Polyurethane Foam Association explains that firmness is independent of density, so a denser foam is not necessarily harder.",
          "Ask for both specifications and the intended application. Cushion thickness, layering, underlying support and the furniture shape also influence how a seat feels. A label such as high density alone does not establish comfort or a service life."
        ]
      },
      {
        "heading": "Webbing: support below the cushion",
        "paragraphs": [
          "Webbing consists of strips spanning and fixed to a frame. Depending on the construction, it can help support seating or a back. Not every sofa uses the same support system; springs or other arrangements may be present.",
          "Loose or deteriorated support can contribute to sagging even if a cushion still looks full. The frame and attachment points need assessment alongside the webbing itself."
        ]
      },
      {
        "heading": "Why the whole build matters",
        "paragraphs": [
          "If a seat dips, the cause may involve filling, support, joints or several components. Describe where it dips and whether it changes when someone sits down. Ask which parts the proposed repair addresses.",
          "Avoid technical performance promises based on one material. Foam specifications, workmanship and actual use all matter, and a reliable lifespan cannot be inferred from density alone."
        ]
      },
      {
        "heading": "Questions to ask before upholstery work",
        "paragraphs": [
          "Ask which components can remain, which need replacement, what foam specification is proposed and how the support is constructed. Request care information for the covering too.",
          "Photographs of the overall piece and the visible damage help start an assessment. Do not dismantle heavy or unstable furniture to identify concealed parts yourself."
        ]
      }
    ],
    "sources": [
      {
        "label": "Polyurethane Foam Association: foam performance",
        "url": "https://pfa.org/foam-performance/"
      }
    ],
    "published": "2026-10-27"
  }
]
