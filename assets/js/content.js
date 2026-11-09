/*
 * Crème et Crema — site content (menu, packages, FAQ…)
 * Every text has a French (fr) and English (en) version.
 * Edit freely; the page rebuilds itself from this file.
 */
window.SITE_CONTENT = {
  menu: [
    {
      id: "coffee",
      title: { fr: "Café", en: "Coffee" },
      items: [
        { name: { fr: "Espresso", en: "Espresso" }, desc: { fr: "Double, riche et corsé", en: "Double shot, rich and bold" }, tags: ["hot"] },
        { name: { fr: "Americano", en: "Americano" }, desc: { fr: "Espresso allongé d'eau chaude", en: "Espresso topped with hot water" }, tags: ["hot", "iced"] },
        { name: { fr: "Cappuccino", en: "Cappuccino" }, desc: { fr: "Espresso et mousse de lait onctueuse", en: "Espresso with velvety milk foam" }, tags: ["hot"] },
        { name: { fr: "Flat white", en: "Flat white" }, desc: { fr: "Espresso et fine mousse de lait veloutée, plus corsé qu'un latte", en: "Espresso with silky microfoam, stronger than a latte" }, tags: ["hot"] },
        { name: { fr: "Latte", en: "Latte" }, desc: { fr: "Espresso et lait vapeur", en: "Espresso and steamed milk" }, tags: ["hot", "iced"] },
        { name: { fr: "Latte vanille", en: "Vanilla latte" }, desc: { fr: "Notre latte avec une touche de vanille", en: "Our latte with a touch of vanilla" }, tags: ["hot", "iced"] }
      ]
    },
    {
      id: "matcha",
      title: { fr: "Matcha", en: "Matcha" },
      items: [
        { name: { fr: "Matcha traditionnel", en: "Traditional matcha" }, desc: { fr: "Fouetté au chasen, sans lait", en: "Whisked with a bamboo chasen, no milk" }, tags: ["hot"] },
        { name: { fr: "Matcha latte", en: "Matcha latte" }, desc: { fr: "Matcha fouetté et lait au choix", en: "Whisked matcha with your choice of milk" }, tags: ["hot", "iced"] }
      ]
    },
    {
      id: "signature",
      title: { fr: "Matcha signature", en: "Signature matcha" },
      items: [
        { name: { fr: "Fraise matcha", en: "Strawberry matcha" }, desc: { fr: "Purée de fraises maison, lait et matcha en couches", en: "House strawberry purée, milk and matcha in layers" }, tags: ["iced"] },
        { name: { fr: "Érable et fleur de sel", en: "Maple sea salt" }, desc: { fr: "Sirop d'érable du Québec et une pincée de fleur de sel", en: "Quebec maple syrup and a pinch of fleur de sel" }, tags: ["hot", "iced"] },
        { name: { fr: "Vanille matcha", en: "Vanilla matcha" }, desc: { fr: "Doux et crémeux", en: "Soft and creamy" }, tags: ["iced"] },
        { name: { fr: "Coco matcha", en: "Coconut matcha" }, desc: { fr: "Une touche tropicale", en: "A tropical twist" }, tags: ["iced"] }
      ]
    },
    {
      id: "more",
      title: { fr: "Et aussi", en: "Also" },
      items: [
        { name: { fr: "Thés", en: "Teas" }, desc: { fr: "Une sélection de thés et tisanes", en: "A selection of teas and herbal teas" }, tags: ["hot"] },
        { name: { fr: "Chocolat chaud", en: "Hot chocolate" }, desc: { fr: "Pour les petits et les grands", en: "For kids and grown-ups" }, tags: ["hot"] },
        { name: { fr: "Desserts", en: "Desserts" }, desc: { fr: "Petites douceurs selon la saison, sur demande", en: "Seasonal sweet bites, on request" }, tags: [] }
      ]
    }
  ],

  menuNote: {
    fr: "Deux laits au choix inclus (2 %, avoine, amande, soya, sans lactose…). Sirops et sucres offerts. Le menu final est choisi avec vous.",
    en: "Two milks of your choice included (2%, oat, almond, soy, lactose-free…). Syrups and sweeteners provided. Your final menu is chosen with you."
  },

  packages: [
    {
      id: "coffee",
      name: { fr: "Café", en: "Coffee" },
      tagline: { fr: "Le bar espresso classique", en: "The classic espresso bar" },
      includes: {
        fr: ["Café chaud à volonté : espresso, cappuccino, latte", "Cafés glacés en option", "Un barista dédié pendant tout l'événement", "Deux laits au choix"],
        en: ["Unlimited hot coffee: espresso, cappuccino, latte", "Iced coffee drinks available", "A dedicated barista for the whole event", "Two milks of your choice"]
      }
    },
    {
      id: "matcha",
      name: { fr: "Matcha", en: "Matcha" },
      tagline: { fr: "Le bar à matcha", en: "The matcha bar" },
      includes: {
        fr: ["Matcha latte chaud ou glacé à volonté", "Un barista dédié pendant tout l'événement", "Deux laits au choix"],
        en: ["Unlimited hot or iced matcha lattes", "A dedicated barista for the whole event", "Two milks of your choice"]
      }
    },
    {
      id: "both",
      name: { fr: "Café + Matcha", en: "Coffee + Matcha" },
      tagline: { fr: "Le meilleur des deux", en: "The best of both" },
      includes: {
        fr: ["Tout le forfait Café et tout le forfait Matcha", "Un barista dédié pendant tout l'événement", "Deux laits au choix"],
        en: ["Everything in Coffee and everything in Matcha", "A dedicated barista for the whole event", "Two milks of your choice"]
      }
    },
    {
      id: "custom",
      name: { fr: "Sur mesure", en: "Custom" },
      tagline: { fr: "Votre événement, à votre façon", en: "Your event, your way" },
      desc: {
        fr: "Une idée précise en tête? On adore ça. On s'adapte toujours avec plaisir à vos besoins, et nos baristas d'expérience peuvent élargir le menu ou créer des boissons juste pour vous.",
        en: "Have something specific in mind? We love that. We're always happy to accommodate your needs, and our experienced baristas can expand the menu or create drinks just for you."
      },
      includes: {
        fr: ["Menu adapté à vos goûts et à vos invités", "Boissons créées par nos baristas pour votre événement", "Durée, nombre d'invités et format flexibles"],
        en: ["A menu tailored to your taste and your guests", "Drinks our baristas create for your event", "Flexible length, guest count and format"]
      },
      cta: { fr: "Parlons-en", en: "Let's talk" }
    }
  ],

  extras: {
    fr: ["Boisson signature", "Lattes protéinés", "Gobelets à votre image", "Heures supplémentaires", "Invités supplémentaires", "Desserts"],
    en: ["Signature drink", "High-protein lattes", "Custom-branded cups", "Extra hours", "Extra guests", "Desserts"]
  },

  steps: [
    { title: { fr: "Demandez une soumission", en: "Request a quote" }, text: { fr: "Date, lieu, nombre d'invités et boissons souhaitées. On vous répond rapidement.", en: "Date, venue, guest count and the drinks you'd like. We'll get back to you quickly." } },
    { title: { fr: "Confirmez votre date", en: "Lock in your date" }, text: { fr: "Un dépôt réserve votre date. On finalise le menu ensemble.", en: "A deposit holds your date. We finalize the menu together." } },
    { title: { fr: "On s'installe", en: "We set up" }, text: { fr: "On arrive à l'avance avec notre eau et tout le matériel. Une simple prise standard suffit.", en: "We arrive early with our own water and all the gear. A standard outlet is all we need." } },
    { title: { fr: "Vos invités se régalent", en: "Your guests enjoy" }, text: { fr: "Boissons faites à la minute, puis on remballe et on laisse l'espace propre.", en: "Drinks made to order, then we pack up and leave the space clean." } }
  ],

  areas: [
    { name: { fr: "Île de Montréal", en: "Island of Montreal" }, zone: 1 },
    { name: { fr: "Laval", en: "Laval" }, zone: 2 },
    { name: { fr: "Longueuil et Rive-Sud", en: "Longueuil and South Shore" }, zone: 2 },
    { name: { fr: "Rive-Nord", en: "North Shore" }, zone: 2 },
    { name: { fr: "Ailleurs au Québec, sur demande", en: "Elsewhere in Quebec, on request" }, zone: 3 }
  ],

  faq: [
    { q: { fr: "Avez-vous besoin d'une prise électrique spéciale?", en: "Do you need a special power outlet?" },
      a: { fr: "Non. Notre chariot fonctionne sur une prise standard de 120 V. On apporte notre propre rallonge.", en: "No. Our cart runs on a standard 120 V outlet. We bring our own heavy-duty extension cord." } },
    { q: { fr: "Avez-vous besoin d'eau courante?", en: "Do you need running water?" },
      a: { fr: "Non. On apporte notre eau et on repart avec les eaux usées.", en: "No. We bring our own water and take our wastewater with us." } },
    { q: { fr: "Offrez-vous des options sans produits laitiers?", en: "Do you have dairy-free options?" },
      a: { fr: "Oui. Vous choisissez vos laits, et on peut offrir tous les types de lait selon vos préférences (avoine, amande, soya, sans lactose…).", en: "Yes. You choose your milks, and we can accommodate any type of milk based on your preferences (oat, almond, soy, lactose-free…)." } },
    { onlyIf: "showMinimums", q: { fr: "Quel est le minimum pour réserver?", en: "What's the minimum booking?" },
      a: { fr: "{minHours} heures de service et {minGuests} invités. Pour un plus petit groupe, écrivez-nous quand même. Nous sommes toujours prêts à créer un forfait sur mesure.", en: "{minHours} hours of service and {minGuests} guests. For a smaller group, reach out anyway. We're always willing to accommodate custom packages." } },
    { unless: "showMinimums", q: { fr: "Faites-vous les petits événements?", en: "Do you accommodate smaller events?" },
      a: { fr: "Oui, avec plaisir! Petit rassemblement ou grande célébration, parlez-nous de votre événement. Chaque soumission est préparée selon vos besoins, et des frais minimums peuvent s'appliquer.", en: "Absolutely! Whether it's an intimate gathering or a large celebration, we'd love to hear about it. Every event is quoted individually based on your needs, and minimum booking charges may apply." } },
    { q: { fr: "Combien d'espace faut-il?", en: "How much space do you need?" },
      a: { fr: "Un petit coin à l'intérieur ou à l'abri, près d'une prise. On confirme les détails avec vous avant l'événement.", en: "A small spot indoors or under cover, near an outlet. We confirm the details with you before the event." } },
    { q: { fr: "Comment réserver?", en: "How do I book?" },
      a: { fr: "Remplissez le formulaire de soumission. Un dépôt confirme votre date.", en: "Fill out the quote form. A deposit confirms your date." } }
  ]
};
